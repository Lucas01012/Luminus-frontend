import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  notifications: boolean;
  autoSave: boolean;
}

const defaultSettings: AppSettings = {
  notifications: true,
  autoSave: true,
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega configurações salvas
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@luminus_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('@luminus_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      const newSettings = { ...settings, [key]: value };
      saveSettings(newSettings);
    },
    [settings]
  );

  const resetSettings = useCallback(() => {
    saveSettings(defaultSettings);
  }, []);

  return {
    settings,
    isLoading,
    updateSetting,
    resetSettings,
  };
}
