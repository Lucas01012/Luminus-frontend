/**
 * Interface para itens do histórico
 * Todos os dados vêm do Firebase (sem cache local)
 */
export interface HistoryItem {
  id: string;                    // ID do Firestore
  type: 'image' | 'document';
  title: string;
  content: string;
  timestamp: number;
  imageUri?: string;             // URL da imagem no Firebase Storage (para histórico de imagens)
  userId: string;                // ID do usuário no Firebase (obrigatório)
  metadata?: {
    confidence?: number;
    pages?: number;
    keywords?: string[];
    fileName?: string;
    fileSize?: number;
    processingTime?: number;
  };
}

export interface FirebaseHistoryImage {
  id?: string;
  usuario_id: string;
  imagem_nome: string;
  imagem_url: string;            // URL da imagem no Firebase Storage
  objeto_detectado: string;
  confianca?: number;
  processing_time?: number;
  timestamp: string;
  tipo: 'analise_imagem';
}

export interface FirebaseHistoryDocument {
  id?: string;
  usuario_id: string;
  arquivo_nome: string;
  formato: string;
  tamanho_bytes: number;
  preview_texto: string;
  resumo?: string;
  palavras_chave?: string[];
  total_paginas?: number;
  total_caracteres: number;
  timestamp: string;
  tipo: 'documento';
}

export type FirebaseHistoryItem = FirebaseHistoryImage | FirebaseHistoryDocument;

