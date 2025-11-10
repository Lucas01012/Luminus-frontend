import { apiService } from './apiService';
import {
  DocumentProcessingOptions,
  SearchDocumentOptions,
  TTSOptions,
  DocumentResponse,
} from '@/src/models';

class DocumentService {
  async processDocument(
    documentUri: string,
    documentType: string,
    options?: DocumentProcessingOptions
  ): Promise<{ success: boolean; data?: DocumentResponse; error?: string }> {
    try {
      const file = {
        uri: documentUri,
        type: documentType,
        name: `document.${documentType.split('/').pop()}`,
      };
      
      const additionalData: Record<string, string> = {};
      
      if (options?.incluirResumo !== undefined) {
        additionalData.gerar_resumo = options.incluirResumo ? 'true' : 'false';
      } else {
        additionalData.gerar_resumo = 'true';
      }

      const response = await apiService['uploadFile'](
        '/documento/processar',
        file,
        additionalData
      );

      const documentData: DocumentResponse = response.data;

      if ('erro' in documentData) {
        return {
          success: false,
          error: (documentData as any).erro,
        };
      }

      return {
        success: true,
        data: documentData,
      };
    } catch (error: any) {
      let errorMessage = 'Erro ao processar documento';
      
      if (error.response?.status === 404) {
        errorMessage = 'Rota /ler-texto não encontrada no backend. Verifique se o servidor Flask está rodando e se a rota foi criada.';
      } else if (error.response?.data?.erro) {
        errorMessage = error.response.data.erro;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async searchInDocument(options: SearchDocumentOptions) {
    try {
      const response = await apiService['api'].post(
        '/documento/buscar-no-documento',
        options
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro na busca no documento',
      };
    }
  }

  async generateDocumentAudio(text: string, options?: TTSOptions) {
    try {
      const payload = {
        texto: text,
        ...options,
      };

      const response = await apiService['api'].post(
        '/documento/gerar-audio-documento',
        payload
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao gerar áudio',
      };
    }
  }

  async getAvailableVoices(language: string = 'pt-BR') {
    try {
      const response = await apiService['api'].get(
        `/documento/vozes-disponiveis?idioma=${language}`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao listar vozes',
      };
    }
  }

  async extractTextFromDocumentImage(imageUri: string) {
    try {
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'document-image.jpg',
      };

      const response = await apiService['uploadFile'](
        '/documento/extrair-texto-imagem',
        file
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro no OCR do documento',
      };
    }
  }
}

export const documentService = new DocumentService();
export default documentService;