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
