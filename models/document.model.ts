export interface DocumentStructure {
  pages?: Array<{
    page_number: number;
    headings: Array<{ text: string; level: number; page: number }>;
    paragraphs: string[];
    images: any[];
  }>;
  headings: Array<{ text: string; level: number; page?: number }>;
  paragraphs: Array<{ text: string; page?: number }>;
  tables: Array<{
    data: string[][];
    rows: number;
    columns: number;
  }>;
  blocks?: Array<{ text: string; confidence: number }>;
  words?: Array<{ text: string; confidence: number }>;
}

export interface ExtractedData {
  arquivo?: string;
  tipo?: string;
  texto_extraido?: string;
  text_content: string;
  total_caracteres?: number;
  total_palavras?: number;
  structure: DocumentStructure;
  estrutura?: DocumentStructure;
  metadata?: {
    total_pages: number;
    title: string;
    author: string;
  };
  metadados?: any;
  confidence?: number;
  processing_time?: number;
  resumo?: DocumentSummary;
  palavras_baixa_confianca?: any[];
  erro?: string;
}

export interface DocumentSummary {
  resumo: string;
  palavras_chave: string[];
  processing_time?: number;
  erro?: string;
}

export interface SearchResult {
  termo_busca: string;
  total_ocorrencias: number;
  resultados: Array<{
    linha: number;
    texto: string;
    contexto: string;
    posicao: number;
  }>;
}

export interface TTSResponse {
  audio_content?: string;
  processing_time?: number;
  erro?: string;
}

export interface VoicesResponse {
  vozes: Array<{
    name: string;
    language_code: string;
    gender: string;
  }>;
  erro?: string;
}