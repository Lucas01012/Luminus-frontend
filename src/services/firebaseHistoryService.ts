import { apiService } from './apiService';
import { HistoryItem, FirebaseHistoryItem } from '@/src/models';
import authService from './authService';

class FirebaseHistoryService {
  async syncImageToFirebase(item: HistoryItem, imageAnalysis: any): Promise<{ success: boolean; firestoreId?: string; error?: string }> {
    try {
      const user = authService.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      if (!imageAnalysis) {
        console.warn('⚠️ imageAnalysis está vazio');
        return { success: false, error: 'Dados de análise não fornecidos' };
      }

      console.log('DEBUG syncImageToFirebase:');
      console.log('- imageAnalysis:', JSON.stringify(imageAnalysis, null, 2));
      console.log('- item:', JSON.stringify(item, null, 2));

      const analysisData = imageAnalysis?.data || imageAnalysis || {};
      
      const objeto = analysisData.objeto || 
                     analysisData.objeto_detectado ||
                     analysisData.descricao || 
                     item.title ||
                     'Análise de imagem';
      
      const confianca = parseFloat(String(analysisData.confianca || 0)) || 
                        parseFloat(String(analysisData.confidence || 0)) ||
                        item.metadata?.confidence || 
                        0;
      
      const processingTime = parseFloat(String(analysisData.processing_time || 0)) || 
                             parseFloat(String(analysisData.processingTime || 0)) ||
                             item.metadata?.processingTime || 
                             0;

      const payload = {
        image_name: item.metadata?.fileName || item.imageUri?.split('/').pop() || 'image.jpg',
        analysis_result: {
          objeto_detectado: objeto,
          confianca: confianca,
          processing_time: processingTime,
          descricao: item.content || objeto,
        }
      };

      console.log('Payload enviado para backend:', JSON.stringify(payload, null, 2));

      const response = await apiService['api'].post('/historico/salvar-imagem', payload);

      console.log('Resposta do backend:', JSON.stringify(response.data, null, 2));

      if (response.data.sucesso) {
        return {
          success: true,
          firestoreId: response.data.doc_id,
        };
      }

      console.warn('Backend retornou sucesso=false:', response.data.erro);
      return { success: false, error: response.data.erro };
    } catch (error: any) {
      console.error('Erro em syncImageToFirebase:', error);
      console.error('Erro completo:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      
      return {
        success: false,
        error: error.response?.data?.erro || error.response?.data?.mensagem || error.message || 'Erro ao sincronizar imagem',
      };
    }
  }

  async syncDocumentToFirebase(item: HistoryItem, documentResult: any): Promise<{ success: boolean; firestoreId?: string; error?: string }> {
    try {
      const user = authService.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const payload = {
        file_name: item.metadata?.fileName || 'document.pdf',
        document_result: {
          text_content: item.content,
          resumo: documentResult.resumo,
          palavras_chave: item.metadata?.keywords || [],
          metadata: {
            total_pages: item.metadata?.pages,
          },
          arquivo_info: {
            formato: item.metadata?.fileName?.split('.').pop() || 'pdf',
            tamanho_bytes: item.metadata?.fileSize || 0,
          }
        }
      };

      const response = await apiService['api'].post('/historico/salvar-documento', payload);

      if (response.data.sucesso) {
        return {
          success: true,
          firestoreId: response.data.doc_id,
        };
      }

      return { success: false, error: response.data.erro };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao sincronizar documento',
      };
    }
  }

  async getImageHistory(limit: number = 20): Promise<{ success: boolean; items?: HistoryItem[]; error?: string }> {
    try {
      const response = await apiService['api'].get(`/historico/imagens?limit=${limit}`);

      if (!response.data.sucesso) {
        return { success: false, error: response.data.erro };
      }

      const items: HistoryItem[] = response.data.historico.map((item: any) => ({
        id: item.id,
        type: 'image' as const,
        title: item.objeto_detectado || 'Análise de imagem',
        content: `Objeto detectado: ${item.objeto_detectado}\nConfiança: ${item.confianca ? (item.confianca * 100).toFixed(1) + '%' : 'N/A'}`,
        timestamp: new Date(item.timestamp).getTime(),
        imageUri: item.imagem_url,
        userId: item.usuario_id,
        metadata: {
          confidence: item.confianca,
          processingTime: item.processing_time,
          fileName: item.imagem_nome,
        },
      }));

      return { success: true, items };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao buscar histórico de imagens',
      };
    }
  }

  async getDocumentHistory(limit: number = 20): Promise<{ success: boolean; items?: HistoryItem[]; error?: string }> {
    try {
      const response = await apiService['api'].get(`/historico/documentos?limit=${limit}`);

      if (!response.data.sucesso) {
        return { success: false, error: response.data.erro };
      }

      const items: HistoryItem[] = response.data.historico.map((item: any) => ({
        id: item.id,
        type: 'document' as const,
        title: item.resumo || item.arquivo_nome,
        content: `${item.resumo || ''}\n\nPreview:\n${item.preview_texto}`,
        timestamp: new Date(item.timestamp).getTime(),
        userId: item.usuario_id,
        metadata: {
          pages: item.total_paginas,
          keywords: item.palavras_chave,
          fileName: item.arquivo_nome,
          fileSize: item.tamanho_bytes,
        },
      }));

      return { success: true, items };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao buscar histórico de documentos',
      };
    }
  }

  async getFullHistory(limit: number = 30): Promise<{ success: boolean; items?: HistoryItem[]; error?: string }> {
    try {
      const response = await apiService['api'].get(`/historico/completo?limit=${limit}`);

      if (!response.data.sucesso) {
        return { success: false, error: response.data.erro };
      }

      const items: HistoryItem[] = response.data.historico.map((item: any) => {
        const isImage = item.tipo === 'analise_imagem';
        
        return {
          id: item.id,
          type: isImage ? ('image' as const) : ('document' as const),
          title: isImage 
            ? (item.objeto_detectado || 'Análise de imagem')
            : (item.resumo || item.arquivo_nome),
          content: isImage
            ? `Objeto detectado: ${item.objeto_detectado}\nConfiança: ${item.confianca ? (item.confianca * 100).toFixed(1) + '%' : 'N/A'}`
            : `${item.resumo || ''}\n\nPreview:\n${item.preview_texto}`,
          timestamp: new Date(item.timestamp).getTime(),
          imageUri: isImage ? item.imagem_url : undefined,
          userId: item.usuario_id,
          metadata: isImage ? {
            confidence: item.confianca,
            processingTime: item.processing_time,
            fileName: item.imagem_nome,
          } : {
            pages: item.total_paginas,
            keywords: item.palavras_chave,
            fileName: item.arquivo_nome,
            fileSize: item.tamanho_bytes,
          },
        };
      });

      return { success: true, items };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao buscar histórico completo',
      };
    }
  }

  async deleteHistoryItem(firestoreId: string, type: 'image' | 'document'): Promise<{ success: boolean; error?: string }> {
    try {
      const tipo = type === 'image' ? 'imagem' : 'documento';
      const response = await apiService['api'].delete(`/historico/deletar/${tipo}/${firestoreId}`);

      if (response.data.sucesso) {
        return { success: true };
      }

      return { success: false, error: response.data.erro };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao deletar item',
      };
    }
  }
}

export const firebaseHistoryService = new FirebaseHistoryService();
export default firebaseHistoryService;
