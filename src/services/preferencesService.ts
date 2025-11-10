import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = '@luminus_preferences';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'pt-BR' | 'en-US' | 'es-ES';
  notifications?: boolean;
  autoAnalyze?: boolean;
  saveQuality?: 'low' | 'medium' | 'high';
  lastSync?: number;
  onboardingCompleted?: boolean;
}

class PreferencesService {
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      return data ? JSON.parse(data) : this.getDefaultPreferences();
    } catch (error) {
      return this.getDefaultPreferences();
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'pt-BR',
      notifications: true,
      autoAnalyze: false,
      saveQuality: 'high',
      onboardingCompleted: false,
    };
  }
  async savePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      throw new Error('Não foi possível salvar as preferências');
    }
  }

  async updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<void> {
    try {
      const preferences = await this.getPreferences();
      preferences[key] = value;
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      throw new Error(`Não foi possível atualizar a preferência: ${key}`);
    }
  }

  async getPreference<K extends keyof UserPreferences>(
    key: K
  ): Promise<UserPreferences[K] | undefined> {
    try {
      const preferences = await this.getPreferences();
      return preferences[key];
    } catch (error) {
      return undefined;
    }
  }

  async resetPreferences(): Promise<void> {
    try {
      const defaults = this.getDefaultPreferences();
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(defaults));
    } catch (error) {
      throw new Error('Não foi possível resetar as preferências');
    }
  }

  async clearPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREFERENCES_KEY);
    } catch (error) {
      throw new Error('Não foi possível limpar as preferências');
    }
  }


  async updateLastSync(): Promise<void> {
    await this.updatePreference('lastSync', Date.now());
  }


  async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getPreference('onboardingCompleted');
    return completed === true;
  }


  async completeOnboarding(): Promise<void> {
    await this.updatePreference('onboardingCompleted', true);
  }
}

export const preferencesService = new PreferencesService();
export default preferencesService;
