import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '@/src/models';
import authService from './authService';

const MAX_HISTORY_ITEMS = 50;
const HISTORY_KEY_PREFIX = '@luminus_history_';

class HistoryService {
  private getStorageKey(userId: string): string {
    return `${HISTORY_KEY_PREFIX}${userId}`;
  }

  async addItem(item: Omit<HistoryItem, 'id' | 'timestamp' | 'userId'>, analysisData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const user = authService.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado. Faça login para salvar no histórico.');
      }

      if (!analysisData) {
        throw new Error('Dados de análise são obrigatórios para salvar no histórico.');
      }

      const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: Date.now(),
        userId: user.uid,
      };

      const storageKey = this.getStorageKey(user.uid);
      const existingData = await AsyncStorage.getItem(storageKey);
      const history: HistoryItem[] = existingData ? JSON.parse(existingData) : [];

      history.unshift(newItem);

      if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
      }

      await AsyncStorage.setItem(storageKey, JSON.stringify(history));
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar no histórico',
      };
    }
  }


  async getHistory(limit: number = MAX_HISTORY_ITEMS): Promise<HistoryItem[]> {
    try {
      const user = authService.getUser();
      
      if (!user) {
        return [];
      }

      const storageKey = this.getStorageKey(user.uid);
      const data = await AsyncStorage.getItem(storageKey);
      
      if (!data) {
        return [];
      }

      const history: HistoryItem[] = JSON.parse(data);
      return history.slice(0, limit);
    } catch (error) {
      return [];
    }
  }


  async getImageHistory(limit: number = MAX_HISTORY_ITEMS): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      const imageHistory = history.filter(item => item.type === 'image');
      return imageHistory.slice(0, limit);
    } catch (error) {
      return [];
    }
  }


  async getDocumentHistory(limit: number = MAX_HISTORY_ITEMS): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      const documentHistory = history.filter(item => item.type === 'document');
      return documentHistory.slice(0, limit);
    } catch (error) {
      return [];
    }
  }

  async deleteItem(itemId: string, type: 'image' | 'document'): Promise<void> {
    try {
      const user = authService.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const storageKey = this.getStorageKey(user.uid);
      const data = await AsyncStorage.getItem(storageKey);
      
      if (!data) {
        return;
      }

      const history: HistoryItem[] = JSON.parse(data);
      const updatedHistory = history.filter(item => item.id !== itemId);
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    } catch (error) {
      throw error;
    }
  }

  async searchHistory(query: string): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      
      if (!query.trim()) {
        return history;
      }
      
      const lowerQuery = query.toLowerCase();
      
      return history.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        (item.metadata?.keywords && item.metadata.keywords.some(k => k.toLowerCase().includes(lowerQuery)))
      );
    } catch (error) {
      return [];
    }
  }


  async refreshHistory(): Promise<HistoryItem[]> {
    return this.getHistory();
  }
}

export const historyService = new HistoryService();
export default historyService;
