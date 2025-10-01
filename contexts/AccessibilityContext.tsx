import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, getColors } from '@/constants/colors';

interface AccessibilitySettings {
  // Configurações de texto
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  boldText: boolean;
  
  // Configurações de áudio
  soundEnabled: boolean;
  speechRate: number; // 0.5 to 2.0
  speechPitch: number; // 0.5 to 2.0
  
  // Configurações de interação
  hapticFeedback: boolean;
  reduceMotion: boolean;
  
  // Configurações específicas para baixa visão
  largeButtons: boolean;
  increasedSpacing: boolean;
  screenReaderEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetToDefaults: () => void;
  
  // Helpers para componentes
  getTextSize: (baseSize: number) => number;
  getSpacing: (baseSpacing: number) => number;
  getButtonHeight: (baseHeight: number) => number;
  shouldUseHighContrast: () => boolean;
}

const STORAGE_KEY = '@LuminusApp:AccessibilitySettings';

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  boldText: false,
  soundEnabled: true,
  speechRate: 0.8,
  speechPitch: 1.0,
  hapticFeedback: true,
  reduceMotion: false,
  largeButtons: false,
  increasedSpacing: false,
  screenReaderEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega configurações salvas e detecta configurações do sistema
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        // Carrega configurações salvas
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
        let loadedSettings = defaultSettings;
        
        if (savedSettings) {
          loadedSettings = { ...defaultSettings, ...JSON.parse(savedSettings) };
        }

        // Detecta configurações do sistema
        const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        const boldTextEnabled = await AccessibilityInfo.isBoldTextEnabled();
        
        const finalSettings = {
          ...loadedSettings,
          screenReaderEnabled,
          reduceMotion: reduceMotionEnabled,
          boldText: boldTextEnabled,
          // Se screen reader estiver ativo, ajusta outras configurações
          largeButtons: screenReaderEnabled ? true : loadedSettings.largeButtons,
          increasedSpacing: screenReaderEnabled ? true : loadedSettings.increasedSpacing,
          fontSize: screenReaderEnabled && loadedSettings.fontSize === 'medium' ? 'large' : loadedSettings.fontSize,
        };

        setSettings(finalSettings);
      } catch (error) {
        console.warn('Erro ao inicializar configurações de acessibilidade:', error);
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();

    // Listeners para mudanças do sistema
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        setSettings(prev => ({
          ...prev,
          screenReaderEnabled: enabled,
          largeButtons: enabled ? true : prev.largeButtons,
          increasedSpacing: enabled ? true : prev.increasedSpacing,
        }));
      }
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      (enabled) => {
        setSettings(prev => ({ ...prev, boldText: enabled }));
      }
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setSettings(prev => ({ ...prev, reduceMotion: enabled }));
      }
    );

    return () => {
      screenReaderListener?.remove();
      boldTextListener?.remove();
      reduceMotionListener?.remove();
    };
  }, []);

  const updateSettings = async (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Salva as configurações (exceto as do sistema)
    try {
      const settingsToSave = {
        ...updatedSettings,
        screenReaderEnabled: undefined, // Não salva configurações do sistema
        reduceMotion: undefined,
        boldText: undefined,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.warn('Erro ao salvar configurações de acessibilidade:', error);
    }
  };

  const resetToDefaults = async () => {
    setSettings(defaultSettings);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Erro ao resetar configurações de acessibilidade:', error);
    }
  };

  // Helper functions
  const getTextSize = (baseSize: number): number => {
    const multipliers = {
      'small': 0.9,
      'medium': 1.0,
      'large': 1.2,
      'extra-large': 1.5,
    };
    return baseSize * multipliers[settings.fontSize];
  };

  const getSpacing = (baseSpacing: number): number => {
    return settings.increasedSpacing ? baseSpacing * 1.5 : baseSpacing;
  };

  const getButtonHeight = (baseHeight: number): number => {
    return settings.largeButtons ? Math.max(baseHeight * 1.3, 56) : baseHeight;
  };

  const shouldUseHighContrast = (): boolean => {
    return settings.highContrast || settings.screenReaderEnabled;
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSettings,
    resetToDefaults,
    getTextSize,
    getSpacing,
    getButtonHeight,
    shouldUseHighContrast,
  };

  // Mostra loading enquanto carrega as configurações
  if (isLoading) {
    return null; // ou um loading component
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  }
  return context;
};

// Hook para obter cores baseadas nas configurações de acessibilidade
export const useAccessibleColors = () => {
  const { shouldUseHighContrast } = useAccessibility();
  return getColors(shouldUseHighContrast());
};

// Hook para obter estilos de texto baseados nas configurações
export const useAccessibleTextStyles = () => {
  const { settings, getTextSize } = useAccessibility();
  
  return {
    getTextStyle: (baseSize: number) => ({
      fontSize: getTextSize(baseSize),
      fontWeight: settings.boldText ? '700' : '400',
      lineHeight: settings.increasedSpacing ? baseSize * 1.8 : baseSize * 1.4,
    }),
    
    getTitleStyle: (baseSize: number) => ({
      fontSize: getTextSize(baseSize),
      fontWeight: settings.boldText ? '800' : '700',
      lineHeight: settings.increasedSpacing ? baseSize * 1.6 : baseSize * 1.3,
      letterSpacing: 0.5,
    }),
  };
};