import axios from "axios";
import { API_CONFIG } from "@/constants/config";
import { DocumentStructure, ExtractedData, DocumentSummary, SearchResult, TTSResponse, VoicesResponse } from "@/models/document.model";
export async function extractTextFromPdf(file: { uri: string; name: string; type: string }): Promise<ExtractedData> {
  try {
    console.log('🔍 Processando PDF:', { name: file.name, type: file.type, uri: file.uri.substring(0, 50) + '...' });
    
    const formData = new FormData();
    
    formData.append('arquivo', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    // Opções adicionais
    formData.append('incluir_resumo', 'true');
    formData.append('extrair_estrutura', 'true');

    const endpoint = `${API_CONFIG.BASE_URL}/documento/processar-documento`;
    console.log('📤 Enviando para:', endpoint);
    console.log('📋 Dados do arquivo:', { name: file.name, type: file.type });

    const response = await axios.post(
      endpoint,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    const data = response.data;
    
    // Normaliza a resposta para o formato esperado pelo frontend
    return {
      text_content: data.texto_extraido || data.text_content || '',
      structure: data.estrutura || data.structure || { headings: [], paragraphs: [], tables: [] },
      metadata: data.metadados || data.metadata,
      confidence: data.confidence,
      processing_time: data.processing_time,
      arquivo: data.arquivo,
      tipo: data.tipo,
      total_caracteres: data.total_caracteres,
      total_palavras: data.total_palavras,
      resumo: data.resumo
    };
  } catch (error) {
    console.error('Erro ao processar PDF:', error);
    return {
      text_content: '',
      structure: { headings: [], paragraphs: [], tables: [] },
      erro: `Erro ao processar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
}

/**
 * Extrai texto de DOCX preservando estrutura
 */
export async function extractTextFromDocx(file: { uri: string; name: string; type: string }): Promise<ExtractedData> {
  try {
    const formData = new FormData();
    
    formData.append('arquivo', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    // Opções adicionais
    formData.append('incluir_resumo', 'true');
    formData.append('extrair_estrutura', 'true');

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/documento/processar-documento`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    const data = response.data;
    
    // Normaliza a resposta para o formato esperado pelo frontend
    return {
      text_content: data.texto_extraido || data.text_content || '',
      structure: data.estrutura || data.structure || { headings: [], paragraphs: [], tables: [] },
      metadata: data.metadados || data.metadata,
      confidence: data.confidence,
      processing_time: data.processing_time,
      arquivo: data.arquivo,
      tipo: data.tipo,
      total_caracteres: data.total_caracteres,
      total_palavras: data.total_palavras,
      resumo: data.resumo
    };
  } catch (error) {
    console.error('Erro ao processar DOCX:', error);
    return {
      text_content: '',
      structure: { headings: [], paragraphs: [], tables: [] },
      erro: `Erro ao processar DOCX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
}

/**
 * OCR avançado para extrair texto de imagens/documentos escaneados
 */
export async function extractTextFromImage(imagemUri: string): Promise<ExtractedData> {
  try {
    const formData = new FormData();
    
    formData.append('imagem', {
      uri: imagemUri,
      type: 'image/jpeg',
      name: 'documento.jpg'
    } as any);

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/documento/extrair-texto-imagem`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    const data = response.data;
    
    // Normaliza a resposta para o formato esperado pelo frontend
    return {
      text_content: data.texto_extraido || '',
      structure: data.estrutura || { headings: [], paragraphs: [], tables: [] },
      confidence: data.confianca_geral,
      processing_time: data.processing_time,
      total_palavras: data.total_palavras,
      palavras_baixa_confianca: data.palavras_baixa_confianca
    };
  } catch (error) {
    console.error('Erro no OCR da imagem:', error);
    return {
      text_content: '',
      structure: { headings: [], paragraphs: [], tables: [] },
      erro: `Erro no OCR da imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
}

/**
 * Gera resumo automático do documento usando Gemini
 */
export async function generateDocumentSummary(textContent: string): Promise<DocumentSummary> {
  try {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/documento/gerar-resumo`,
      { text_content: textContent },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    return response.data as DocumentSummary;
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
    return {
      resumo: '',
      palavras_chave: [],
      erro: `Erro ao gerar resumo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
}

// Note: TTS functions moved to separate tts_service.ts

/**
 * Extrai palavras-chave importantes do texto (função local)
 */
export function extractKeywordsFromText(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  
  // Remove palavras comuns (stop words)
  const stopWords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem', 'sob', 'sobre',
    'e', 'ou', 'mas', 'se', 'que', 'quando', 'como', 'onde', 'porque', 'então',
    'ele', 'ela', 'eles', 'elas', 'eu', 'tu', 'você', 'nós', 'vós', 'vocês',
    'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
    'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'isso', 'aquilo'
  ]);
  
  // Filtra palavras significativas
  const wordCount: { [key: string]: number } = {};
  
  for (const word of words) {
    const cleanWord = word.replace(/[^a-záàâãéèêíìîóòôõúùûç]/g, '');
    if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
      wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
    }
  }
  
  // Ordena por frequência e pega as top 10
  const sortedWords = Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  return sortedWords;
}

/**
 * Busca palavras-chave no documento e retorna contexto (função local)
 */
export function searchTextInDocument(textContent: string, searchTerm: string): SearchResult {
  const lines = textContent.split('\n');
  const results: Array<{
    linha: number;
    texto: string;
    contexto: string;
    posicao: number;
  }> = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    if (lowerLine.includes(lowerSearchTerm)) {
      // Contexto: linha anterior, atual e próxima
      const contextStart = Math.max(0, i - 1);
      const contextEnd = Math.min(lines.length, i + 2);
      const context = lines.slice(contextStart, contextEnd).join('\n');
      
      results.push({
        linha: i + 1,
        texto: line.trim(),
        contexto: context,
        posicao: lowerLine.indexOf(lowerSearchTerm),
      });
    }
  }
  
  return {
    termo_busca: searchTerm,
    total_ocorrencias: results.length,
    resultados: results.slice(0, 10), // Limita a 10 resultados
  };
}

/**
 * Processa arquivo de documento (detecta tipo e chama função apropriada)
 */
export async function processDocumentFile(
  file: { uri: string; name: string; type: string }
): Promise<ExtractedData> {
  try {
    console.log('🔄 processDocumentFile - Iniciando:', { 
      name: file.name, 
      type: file.type, 
      uri: file.uri?.substring(0, 50) + '...' 
    });
    
    const formData = new FormData();
    
    formData.append('arquivo', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    // Opções adicionais
    formData.append('incluir_resumo', 'true');
    formData.append('extrair_estrutura', 'true');

    // Para imagens, usa endpoint específico
    const filename = file.name.toLowerCase();
    let endpoint = API_CONFIG.ENDPOINTS.DOCUMENTO;
    let fieldName = 'arquivo';

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'];
    if (imageExtensions.some(ext => filename.endsWith(ext))) {
      endpoint = API_CONFIG.ENDPOINTS.OCR;
      fieldName = 'imagem';
      
      console.log('🖼️ Detectada imagem, usando endpoint OCR');
      
      // Remove o campo arquivo e adiciona como imagem
      formData.delete('arquivo');
      formData.append('imagem', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    }

    const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log('📤 URL completa:', fullUrl);
    console.log('📋 Campo usado:', fieldName);
    console.log('📄 Arquivo:', { name: file.name, type: file.type });

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${endpoint}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    const data = response.data;
    
    // Normaliza a resposta para o formato esperado pelo frontend
    return {
      text_content: data.texto_extraido || data.text_content || '',
      structure: data.estrutura || data.structure || { headings: [], paragraphs: [], tables: [] },
      metadata: data.metadados || data.metadata,
      confidence: data.confianca_geral || data.confidence,
      processing_time: data.processing_time,
      arquivo: data.arquivo || file.name,
      tipo: data.tipo,
      total_caracteres: data.total_caracteres,
      total_palavras: data.total_palavras,
      resumo: data.resumo,
      palavras_baixa_confianca: data.palavras_baixa_confianca
    };
  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
    return {
      text_content: '',
      structure: { headings: [], paragraphs: [], tables: [] },
      erro: `Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
}
