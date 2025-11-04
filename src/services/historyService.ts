import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  id: string;
  type: 'image' | 'document';
  title: string;
  content: string;
  timestamp: number;
  imageUri?: string;
  metadata?: {
    confidence?: number;
    pages?: number;
    keywords?: string[];
  };
}

const HISTORY_KEY = '@luminus_history';
const MAX_HISTORY_ITEMS = 50;

class HistoryService {
  async addItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> {
    try {
      const history = await this.getHistory();
      
      const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      
      history.unshift(newItem);
      
      if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
      }
      
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erro ao adicionar item ao histórico:', error);
      throw error;
    }
  }

  async getHistory(): Promise<HistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao deletar item do histórico:', error);
      throw error;
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      throw error;
    }
  }

  async searchHistory(query: string): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      const lowerQuery = query.toLowerCase();
      
      return history.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Erro ao buscar no histórico:', error);
      return [];
    }
  }
}

export const historyService = new HistoryService();
export default historyService;
