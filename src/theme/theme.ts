import { Colors, Typography, Spacing, BorderRadius, Shadows, Theme } from './types';

// Cores do modo escuro (padrão para acessibilidade)
const darkColors: Colors = {
  // Cores primárias - Roxo vibrante para destaque
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',
  
  // Cores secundárias - Azul complementar
  secondary: '#3B82F6',
  secondaryLight: '#60A5FA',
  secondaryDark: '#2563EB',
  
  // Cores de fundo - Preto profundo para contraste
  background: '#0F0F0F',
  backgroundSecondary: '#1A1A1A',
  backgroundCard: '#262626',
  
  // Cores de superfície
  surface: '#171717',
  surfaceVariant: '#404040',
  
  // Cores de texto - Alto contraste
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textDisabled: '#6B7280',
  textInverse: '#000000',
  
  // Cores de estado
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
  
  // Cores de contorno
  outline: '#525252',
  outlineVariant: '#737373',
  
  // Cores especiais
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
  
  // Cores de acessibilidade
  highContrast: '#FFFFFF',
  lowContrast: '#404040',
};

// Cores do modo claro (para usuários que preferem)
const lightColors: Colors = {
  // Cores primárias
  primary: '#7C3AED',
  primaryLight: '#8B5CF6',
  primaryDark: '#6D28D9',
  
  // Cores secundárias
  secondary: '#2563EB',
  secondaryLight: '#3B82F6',
  secondaryDark: '#1D4ED8',
  
  // Cores de fundo
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundCard: '#FFFFFF',
  
  // Cores de superfície
  surface: '#F3F4F6',
  surfaceVariant: '#E5E7EB',
  
  // Cores de texto
  text: '#111827',
  textSecondary: '#374151',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Cores de estado
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0891B2',
  
  // Cores de contorno
  outline: '#D1D5DB',
  outlineVariant: '#9CA3AF',
  
  // Cores especiais
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Cores de acessibilidade
  highContrast: '#000000',
  lowContrast: '#6B7280',
};

// Tipografia escalável para acessibilidade
const typography: Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

// Espaçamento consistente
const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Bordas arredondadas modernas
const borderRadius: BorderRadius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// Sombras suaves
const shadows: Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Tema escuro (padrão)
export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: true,
};

// Tema claro
export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: false,
};

export { darkColors, lightColors, typography, spacing, borderRadius, shadows };