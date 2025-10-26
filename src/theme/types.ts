export interface Colors {
  // Cores primárias
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Cores secundárias
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Cores de fundo
  background: string;
  backgroundSecondary: string;
  backgroundCard: string;
  
  // Cores de superfície
  surface: string;
  surfaceVariant: string;
  
  // Cores de texto
  text: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  
  // Cores de estado
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Cores de contorno
  outline: string;
  outlineVariant: string;
  
  // Cores especiais
  shadow: string;
  overlay: string;
  
  // Cores de acessibilidade
  highContrast: string;
  lowContrast: string;
}

export interface Typography {
  // Tamanhos de fonte
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  
  // Pesos de fonte
  fontWeight: {
    light: '300';
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
    extrabold: '800';
  };
  
  // Alturas de linha
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  
  // Famílias de fonte
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface BorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Shadows {
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  isDark: boolean;
}