import { Colors, Typography, Spacing, BorderRadius, Shadows, Theme } from './types';

const darkColors: Colors = {
  primary: '#1E90FF',
  primaryLight: '#4DA6FF',
  primaryDark: '#0066CC',
  
  secondary: '#00A8E8',
  secondaryLight: '#33B8F0',
  secondaryDark: '#0077B6',
  
  background: '#111111',
  backgroundSecondary: '#1A1A1A',
  backgroundCard: '#1A1A1A',
  
  surface: '#111111',
  surfaceVariant: '#1F1F1F',
  
  text: '#EEEEEE',
  textSecondary: '#CCCCCC',
  textDisabled: '#888888',
  textInverse: '#111111',
  
  success: '#00D9A5',
  warning: '#FFB300',
  error: '#FF5252',
  info: '#1E90FF',
  
  outline: '#333333',
  outlineVariant: '#555555',
  
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.8)',
  
  highContrast: '#EEEEEE',
  lowContrast: '#888888',
};

const lightColors: Colors = {
  primary: '#005AB5',
  primaryLight: '#0284C7',
  primaryDark: '#003D80',
  
  secondary: '#004C70',
  secondaryLight: '#0369A1',
  secondaryDark: '#00344D',
  
  background: '#FAFAFA',
  backgroundSecondary: '#F5F5F5',
  backgroundCard: '#FFFFFF',
  
  surface: '#FAFAFA',
  surfaceVariant: '#EFEFEF',
  
  text: '#000000',
  textSecondary: '#2A2A2A',
  textDisabled: '#707070',
  textInverse: '#FFFFFF',
  
  success: '#00796B',
  warning: '#D97706',
  error: '#B71C1C',
  info: '#005AB5',
  
  outline: '#C0C0C0',
  outlineVariant: '#D0D0D0',
  
  shadow: '#00000040',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  highContrast: '#000000',
  lowContrast: '#707070',
};

const typography: Typography = {
  fontSize: {
    xs: 15,
    sm: 17,
    md: 19,
    lg: 22,
    xl: 28,
    xxl: 36,
    xxxl: 54,
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

const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const borderRadius: BorderRadius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

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

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: true,
};

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: false,
};

export { darkColors, lightColors, typography, spacing, borderRadius, shadows };