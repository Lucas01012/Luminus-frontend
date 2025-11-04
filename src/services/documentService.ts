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

// Tipos para a resposta do backend
export interface DocumentStructure {
  headings?: Array<{
    text: string;
    level: number;
    page?: number;
  }>;
  paragraphs?: Array<{
    text: string;
    page?: number;
    confidence?: number;
  }>;
  blocks?: Array<{
    text: string;
    confidence?: number;
  }>;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  tables?: Array<{
    data: string[][];
    rows: number;
    columns: number;
  }>;
  pages?: Array<{
    page_number: number;
    headings: any[];
    paragraphs: any[];
    images: any[];
  }>;
}

export interface DocumentMetadata {
  total_pages?: number;
  title?: string;
  author?: string;
}

export interface DocumentResponse {
  text_content: string;
  structure?: DocumentStructure;
  metadata?: DocumentMetadata;
  confidence?: number;
  resumo?: string;
  palavras_chave?: string[];
}

class DocumentService {
  // Processar documentos (PDF, DOCX, imagens) - 1 página com resumo automático
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

      // Backend agora usa funções especializadas:
      // - extract_text_from_pdf() para PDFs (primeira página)
      // - extract_text_from_docx() para Word
      // - extract_text_from_image() para imagens/documentos escaneados
      // - generate_document_summary() para resumo com Gemini
      
      const additionalData: Record<string, string> = {};
      
      if (options?.incluirResumo !== undefined) {
        additionalData.gerar_resumo = options.incluirResumo ? 'true' : 'false';
      } else {
        additionalData.gerar_resumo = 'true'; // Sempre gera resumo por padrão
      }

      // v2.0: Endpoint correto é /documento/processar com campo 'arquivo'
      const response = await apiService['uploadFile'](
        '/documento/processar',
        file,
        additionalData
      );

      // Valida e estrutura a resposta
      const documentData: DocumentResponse = response.data;

      // Verifica se tem erro
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
      // Tratamento de erro melhorado
      let errorMessage = 'Erro ao processar documento';
      
      if (error.response?.status === 404) {
        errorMessage = '❌ Rota /ler-texto não encontrada no backend. Verifique se o servidor Flask está rodando e se a rota foi criada.';
      } else if (error.response?.data?.erro) {
        errorMessage = error.response.data.erro;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('📄 Erro ao processar documento:', errorMessage);

      return {
        success: false,
        error: errorMessage,
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