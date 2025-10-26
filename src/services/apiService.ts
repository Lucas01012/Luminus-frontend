import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Configuração base da API
const BASE_URL = 'http://localhost:5000'; // Altere para o IP do backend se necessário

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 30000, // 30 segundos para uploads grandes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para requests
    this.api.interceptors.request.use(
      (config) => {
        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.api.interceptors.response.use(
      (response) => {
        console.log(`📥 API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Método genérico para upload de arquivos
  private async uploadFile(
    endpoint: string, 
    file: { uri: string; name?: string; type?: string },
    additionalData?: Record<string, any>
  ): Promise<any> {
    const formData = new FormData();
    
    // Adiciona o arquivo ao FormData
    const fileData: any = {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'upload.jpg',
    };
    
    if (endpoint.includes('imagem')) {
      formData.append('imagem', fileData);
    } else if (endpoint.includes('arquivo')) {
      formData.append('arquivo', fileData);
    }

    // Adiciona dados adicionais se existirem
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Análise de imagens
  async analyzeImage(
    imageUri: string, 
    mode: 'gemini' | 'vision' = 'gemini'
  ) {
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

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao analisar imagem',
      };
    }
  }

  // Análise rápida de imagem
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

  // Análise ultra rápida
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

  // OCR de texto em imagem
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