import React, { createContext, useContext, ReactNode } from 'react';
import { useAppSettings } from '../hooks/useAppSettings';

interface AppSettings {
  notifications: boolean;
  autoSave: boolean;
}

interface AppSettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const settingsHook = useAppSettings();

  return (
    <AppSettingsContext.Provider value={settingsHook}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettingsContext() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettingsContext must be used within AppSettingsProvider');
  }
  return context;
}
