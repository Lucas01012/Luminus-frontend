import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getBaseURL(): string {
  const configURL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
  
  if (configURL && configURL !== 'http://192.168.0.100:5000') {
    return configURL;
  }
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000';
  } else {
    return 'http://localhost:5000';
  }
}

const BASE_URL = getBaseURL();

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.api.get('/', { timeout: 5000 });
      return true;
    } catch (error: any) {
      console.error('Erro ao conectar com backend:', error.message);
      return false;
    }
  }

  async uploadFile(
    endpoint: string, 
    file: { uri: string; name?: string; type?: string },
    additionalData?: Record<string, any>
  ): Promise<any> {
    try {
      const formData = new FormData();
      
      const fileData: any = {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || 'image.jpg',
      };
      
      const fieldName = endpoint.includes('documento') ? 'arquivo' : 'imagem';
      formData.append(fieldName, fileData as any);

      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });
      }

      const response = await this.api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000,
        transformRequest: [(data) => data],
      });

      return response;
      
    } catch (error: any) {
      console.error('Erro no upload:', error.message);
      throw error;
    }
  }

  async analyzeImage(
    imageUri: string, 
    mode: 'gemini' | 'vision' = 'gemini'
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };

      const response = await this.uploadFile(
        `/analisar?modo=${mode}`,
        file
      );

      let resultData = response.data;
      
      if (Array.isArray(resultData)) {
        if (resultData.length > 0) {
          resultData = resultData[0];
        } else {
          return {
            success: false,
            error: 'Resposta vazia do backend',
          };
        }
      }
      
      if (resultData.labels && Array.isArray(resultData.labels)) {
        if (resultData.labels.length > 0) {
          resultData = resultData.labels[0];
        } else {
          return {
            success: false,
            error: 'Nenhum objeto identificado na imagem',
          };
        }
      }

      return {
        success: true,
        data: resultData,
      };
    } catch (error: any) {
      if (
        mode === 'gemini' && 
        error.response?.data?.erro && 
        error.response.data.erro.includes('429')
      ) {
        try {
          return await this.analyzeImage(imageUri, 'vision');
        } catch (visionError: any) {
          return {
            success: false,
            error: 'Quota do Gemini excedida. Aguarde 1 minuto e tente novamente.',
          };
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.erro || error.message || 'Erro ao analisar imagem',
      };
    }
  }

  async analyzeImageFast(imageUri: string) {
    try {
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };

      const response = await this.uploadFile('/analisar-rapido', file);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro na análise rápida',
      };
    }
  }

  async analyzeImageUltraFast(imageUri: string) {
    try {
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };

      const response = await this.uploadFile('/analisar-ultra', file);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro na análise ultra rápida',
      };
    }
  }

  async extractTextFromImage(imageUri: string) {
    try {
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };

      const response = await this.uploadFile('/ler-texto', file);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao extrair texto',
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;