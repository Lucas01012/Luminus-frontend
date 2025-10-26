import { apiService } from './apiService';

export interface DocumentProcessingOptions {
  incluirResumo?: boolean;
  extrairEstrutura?: boolean;
}

export interface SearchDocumentOptions {
  textoDocumento: string;
  termoBusca: string;
}

export interface TTSOptions {
  idioma?: string;
  voz?: string;
  genero?: 'MALE' | 'FEMALE';
  velocidade?: number;
  tom?: number;
  adicionarPausas?: boolean;
  enfatizarTitulos?: boolean;
  velocidadeVariavel?: boolean;
}

class DocumentService {
  // Processar documentos (PDF, DOCX, imagens)
  async processDocument(
    documentUri: string,
    documentType: string,
    options?: DocumentProcessingOptions
  ) {
    try {
      const file = {
        uri: documentUri,
        type: documentType,
        name: `document.${documentType.split('/').pop()}`,
      };

      const additionalData: Record<string, string> = {};
      
      if (options?.incluirResumo !== undefined) {
        additionalData.incluir_resumo = options.incluirResumo.toString();
      }
      
      if (options?.extrairEstrutura !== undefined) {
        additionalData.extrair_estrutura = options.extrairEstrutura.toString();
      }

      const response = await apiService['uploadFile'](
        '/documento/processar-documento',
        file,
        additionalData
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao processar documento',
      };
    }
  }

  // Buscar texto no documento
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

  // Gerar áudio do documento (TTS)
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

  // Listar vozes disponíveis
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

  // OCR especializado para documentos em imagem
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