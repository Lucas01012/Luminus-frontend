import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Theme } from './types';
import { darkTheme, lightTheme } from './theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Começa com modo escuro por padrão (melhor para acessibilidade)
  const [isDark, setIsDark] = useState(true);
  
  // Observa mudanças no esquema de cores do sistema
  useEffect(() => {
    const systemColorScheme = Appearance.getColorScheme();
    setIsDark(systemColorScheme === 'dark' || systemColorScheme === null);
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
  };

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode);
  };

  const currentTheme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme: currentTheme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

// Hook para acessibilidade - detecta se o usuário prefere alto contraste
export const useAccessibility = () => {
  const { theme, isDark } = useTheme();
  
  return {
    theme,
    isDark,
    // Retorna cores com maior contraste para melhor acessibilidade
    highContrastColors: {
      text: isDark ? '#FFFFFF' : '#000000',
      background: isDark ? '#000000' : '#FFFFFF',
      primary: isDark ? '#A78BFA' : '#6D28D9',
    },
    // Tamanhos de fonte aumentados para acessibilidade
    accessibleFontSizes: {
      ...theme.typography.fontSize,
      xs: theme.typography.fontSize.xs + 2,
      sm: theme.typography.fontSize.sm + 2,
      md: theme.typography.fontSize.md + 2,
      lg: theme.typography.fontSize.lg + 2,
      xl: theme.typography.fontSize.xl + 4,
    },
  };
};