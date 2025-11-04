export interface Colors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  background: string;
  backgroundSecondary: string;
  backgroundCard: string;
  
  surface: string;
  surfaceVariant: string;
  
  text: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  
  success: string;
  warning: string;
  error: string;
  info: string;
  
  outline: string;
  outlineVariant: string;
  
  shadow: string;
  overlay: string;
  
  highContrast: string;
  lowContrast: string;
}

export interface Typography {
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  
  fontWeight: {
    light: '300';
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
    extrabold: '800';
  };
  
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  
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