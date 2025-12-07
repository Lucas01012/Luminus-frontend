import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@luminus_auth_token';

function getBaseURL(): string {
  // Prioridade 1: Variável de ambiente
  const configURL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
  
  if (configURL) {
    console.log('🌐 API URL (from config):', configURL);
    return configURL;
  }
  
  // Prioridade 2: URLs padrão por plataforma
  let defaultURL = 'http://localhost:5000';
  
  if (Platform.OS === 'android') {
    // Para emulador Android: 10.0.2.2 = localhost da máquina host
    defaultURL = 'http://10.0.2.2:5000';
  } else if (Platform.OS === 'ios') {
    // Para simulador iOS: localhost funciona
    defaultURL = 'http://localhost:5000';
  }
  
  console.log('🌐 API URL (default):', defaultURL);
  return defaultURL;
}

const BASE_URL = getBaseURL(); 

class ApiService {
  private api: AxiosInstance;

  constructor() {
    console.log('🚀 Inicializando ApiService...');
    console.log('📱 Platform:', Platform.OS);
    console.log('🌐 Base URL:', BASE_URL);
    
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      async (config) => {
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
      },
      async (error) => {
        if (error.code === 'ECONNABORTED') {
          console.error('⏱️ Timeout Error:', error.config?.url);
        } else if (error.code === 'ERR_NETWORK') {
          console.error('🌐 Network Error - Backend não acessível:', BASE_URL);
          console.error('💡 Verifique se:');
          console.error('   1. O backend Flask está rodando');
          console.error('   2. O IP está correto para seu dispositivo/emulador');
          console.error('   3. O firewall não está bloqueando a conexão');
        } else if (error.response) {
          console.error('❌ Response Error:', error.response.status, error.config?.url);
        } else {
          console.error('❌ Unknown Error:', error.message);
        }
        
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
          await AsyncStorage.removeItem('@luminus_user_data');
        }
        
        return Promise.reject(error);
      }
    );
  }

  async testConnection(): Promise<{ success: boolean; message?: string; url?: string }> {
    try {
      console.log('🔍 Testando conexão com:', BASE_URL);
      const startTime = Date.now();
      await this.api.get('/', { timeout: 30000 }); // 30s para acordar o Render
      const duration = Date.now() - startTime;
      console.log(`✅ Conexão OK! (${duration}ms)`);
      return { 
        success: true, 
        message: `Conectado em ${duration}ms`,
        url: BASE_URL 
      };
    } catch (error: any) {
      console.error('❌ Falha na conexão:', error.message);
      let errorMessage = 'Erro ao conectar com o backend';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout - Backend não respondeu em 30s';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Backend não acessível. Verifique se está rodando.';
      } else if (error.response) {
        errorMessage = `Backend retornou erro ${error.response.status}`;
      }
      
      return { 
        success: false, 
        message: errorMessage,
        url: BASE_URL 
      };
    }
  }

  getBaseURL(): string {
    return BASE_URL;
  }

  async getUserProfile(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await this.api.get('/perfil-usuario');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao obter perfil do usuário',
      };
    }
  }

  async testProtectedRoute(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await this.api.get('/rota-protegida');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao acessar rota protegida',
      };
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

      // Timeout maior para documentos (120s) vs imagens (60s)
      const timeout = endpoint.includes('documento') ? 120000 : 60000;

      const response = await this.api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout,
        transformRequest: [(data) => data],
      });

      return response;
      
    } catch (error: any) {
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