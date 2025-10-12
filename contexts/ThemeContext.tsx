import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, Theme, getTheme } from '@/constants/themes';
import { FontSizeOption, FONT_SIZES } from '@/constants/accessibilityDesign';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  getFontSize: (key: keyof typeof FONT_SIZES.medium) => number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@VisionApp:theme';
const FONT_SIZE_STORAGE_KEY = '@VisionApp:fontSize';
const SOUND_STORAGE_KEY = '@VisionApp:sound';
const HAPTICS_STORAGE_KEY = '@VisionApp:haptics';
const MOTION_STORAGE_KEY = '@VisionApp:motion';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('medium');
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedTheme, savedFontSize, savedSound, savedHaptics, savedMotion] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY),
        AsyncStorage.getItem(SOUND_STORAGE_KEY),
        AsyncStorage.getItem(HAPTICS_STORAGE_KEY),
        AsyncStorage.getItem(MOTION_STORAGE_KEY),
      ]);

      if (savedTheme) setThemeModeState(savedTheme as ThemeMode);
      if (savedFontSize) setFontSizeState(savedFontSize as FontSizeOption);
      if (savedSound !== null) setSoundEnabledState(savedSound === 'true');
      if (savedHaptics !== null) setHapticsEnabledState(savedHaptics === 'true');
      if (savedMotion !== null) setReducedMotionState(savedMotion === 'true');
    } catch (error) {
      console.warn('Failed to load theme settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme mode:', error);
    }
  };

  const setFontSize = async (size: FontSizeOption) => {
    setFontSizeState(size);
    try {
      await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
    } catch (error) {
      console.warn('Failed to save font size:', error);
    }
  };

  const setSoundEnabled = async (enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      await AsyncStorage.setItem(SOUND_STORAGE_KEY, enabled.toString());
    } catch (error) {
      console.warn('Failed to save sound setting:', error);
    }
  };

  const setHapticsEnabled = async (enabled: boolean) => {
    setHapticsEnabledState(enabled);
    try {
      await AsyncStorage.setItem(HAPTICS_STORAGE_KEY, enabled.toString());
    } catch (error) {
      console.warn('Failed to save haptics setting:', error);
    }
  };

  const setReducedMotion = async (enabled: boolean) => {
    setReducedMotionState(enabled);
    try {
      await AsyncStorage.setItem(MOTION_STORAGE_KEY, enabled.toString());
    } catch (error) {
      console.warn('Failed to save motion setting:', error);
    }
  };

  const getFontSize = (key: keyof typeof FONT_SIZES.medium): number => {
    return FONT_SIZES[fontSize][key];
  };

  const theme = getTheme(themeMode);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        fontSize,
        setFontSize,
        soundEnabled,
        setSoundEnabled,
        hapticsEnabled,
        setHapticsEnabled,
        reducedMotion,
        setReducedMotion,
        getFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
