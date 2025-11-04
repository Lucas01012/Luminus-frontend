import { apiService } from './apiService';
import Constants from 'expo-constants';

/**
 * Helper para debug e teste da conexão com o backend
 */
export class ApiDebugHelper {
  /**
   * Testa a conexão básica com o backend
   */
  static async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const baseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'não configurado';

      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const text = await response.text();
        return {
          success: true,
          message: `Conexão OK! Backend respondeu: "${text}"`,
          details: {
            status: response.status,
            url: baseUrl,
            response: text,
          },
        };
      } else {
        return {
          success: false,
          message: `Backend respondeu com erro ${response.status}`,
          details: {
            status: response.status,
            statusText: response.statusText,
          },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Erro de conexão: ${error.message}`,
        details: {
          error: error.toString(),
          baseUrl: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL,
        },
      };
    }
  }

  static async testImageAnalysis(imageUri: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const result = await apiService.analyzeImageFast(imageUri);

      if (result.success) {
        return {
          success: true,
          message: 'Análise de imagem funcionando!',
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: `Erro na análise: ${result.error}`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao testar análise: ${error.message}`,
      };
    }
  }

  static logDebugInfo() {
    console.log('API URL:', Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'NÃO CONFIGURADO');
    console.log('Platform:', Constants.platform);
    console.log('Expo Version:', Constants.expoVersion);
  }

  /**
   * Verifica configuração da API
   */
  static checkConfiguration(): { isConfigured: boolean; url: string; warnings: string[] } {
    const url = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
    const warnings: string[] = [];

    if (!url) {
      warnings.push('⚠️ API URL não configurada no app.json');
    } else if (url.includes('localhost')) {
      warnings.push('⚠️ Usando localhost - não funcionará em dispositivos físicos!');
    } else if (url.includes('10.0.2.2')) {
      warnings.push('ℹ️ Usando IP do emulador Android');
    }

    return {
      isConfigured: !!url,
      url: url || 'não configurado',
      warnings,
    };
  }
}

export default ApiDebugHelper;
