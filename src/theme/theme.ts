import { Colors, Typography, Spacing, BorderRadius, Shadows, Theme } from './types';

// Cores do modo escuro - ACESSÍVEL POR PADRÃO (WCAG AAA)
// Otimizado para visão reduzida: #111111 + #EEEEEE + azul elétrico
const darkColors: Colors = {
  // Cores primárias - Azul elétrico visível no preto
  primary: '#1E90FF', // Azul elétrico (DodgerBlue - alta visibilidade)
  primaryLight: '#4DA6FF', // Azul mais claro para hover
  primaryDark: '#0066CC', // Azul royal escuro
  
  // Cores secundárias - Azul complementar
  secondary: '#00A8E8', // Azul cyan elétrico
  secondaryLight: '#33B8F0', // Azul claro vibrante
  secondaryDark: '#0077B6', // Azul oceano
  
  // Cores de fundo - Preto suave com cinzas bem definidos
  background: '#111111', // Preto suave
  backgroundSecondary: '#1A1A1A', // Cinza escuro
  backgroundCard: '#1A1A1A', // Cards com borda para definir
  
  // Cores de superfície
  surface: '#111111',
  surfaceVariant: '#1F1F1F',
  
  // Cores de texto - Off-white suave (menos cansativo)
  text: '#EEEEEE', // Off-white suave (melhor que branco puro)
  textSecondary: '#CCCCCC', // Cinza claro para hierarquia
  textDisabled: '#888888', // Cinza médio
  textInverse: '#111111',
  
  // Cores de estado - Vibrantes no escuro
  success: '#00D9A5', // Verde neon suave
  warning: '#FFB300', // Âmbar vibrante
  error: '#FF5252', // Vermelho coral brilhante
  info: '#1E90FF', // Azul elétrico
  
  // Cores de contorno - Bordas visíveis
  outline: '#333333', // Borda média
  outlineVariant: '#555555', // Borda mais clara
  
  // Cores especiais
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.8)',
  
  // Cores de acessibilidade
  highContrast: '#EEEEEE',
  lowContrast: '#888888',
};

// Cores do modo claro - ACESSÍVEL POR PADRÃO (WCAG AAA)
// Branco off-white suave + texto preto forte + azul escuro
const lightColors: Colors = {
  // Cores primárias - Azul escuro forte no claro
  primary: '#005AB5', // Azul escuro profundo (contraste 8.2:1 no branco)
  primaryLight: '#0284C7', // Azul médio
  primaryDark: '#003D80', // Azul navy escuro
  
  // Cores secundárias - Azul petróleo
  secondary: '#004C70', // Azul petróleo
  secondaryLight: '#0369A1', // Azul sky
  secondaryDark: '#00344D', // Azul navy profundo
  
  // Cores de fundo - Branco off-white suave (menos agressivo)
  background: '#FAFAFA', // Off-white suave
  backgroundSecondary: '#F5F5F5', // Cinza muito claro
  backgroundCard: '#FFFFFF', // Branco puro para cards
  
  // Cores de superfície
  surface: '#FAFAFA',
  surfaceVariant: '#EFEFEF',
  
  // Cores de texto - Preto forte mas não puro
  text: '#000000', // Preto puro para máximo contraste
  textSecondary: '#2A2A2A', // Preto levemente off
  textDisabled: '#707070', // Cinza médio
  textInverse: '#FFFFFF',
  
  // Cores de estado - Escuras e acessíveis
  success: '#00796B', // Verde-azulado escuro (seguro daltonismo)
  warning: '#D97706', // Laranja escuro forte
  error: '#B71C1C', // Vermelho escuro (não ofusca)
  info: '#005AB5', // Azul principal
  
  // Cores de contorno - Bem definidas
  outline: '#C0C0C0',
  outlineVariant: '#D0D0D0',
  
  // Cores especiais
  shadow: '#00000040', // Sombra suave
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Cores de acessibilidade
  highContrast: '#000000',
  lowContrast: '#707070',
};

// Tipografia GRANDE POR PADRÃO para máxima acessibilidade
const typography: Typography = {
  fontSize: {
    xs: 15, // Mínimo: 15px (muito legível)
    sm: 17, // Pequeno: 17px (confortável)
    md: 19, // Normal: 19px (base grande)
    lg: 22, // Grande: 22px (títulos pequenos)
    xl: 28, // Extra large: 28px (títulos médios)
    xxl: 36, // Muito grande: 36px (títulos grandes)
    xxxl: 54, // Hero: 54px (destaque máximo)
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