// Sistema de tipografia otimizado para baixa visão
export const TYPOGRAPHY = {
  // Tamanhos de fonte maiores para melhor legibilidade
  fontSize: {
    xs: 14, // Mínimo 14px para acessibilidade
    sm: 16, // Padrão aumentado
    md: 18, // Médio aumentado
    lg: 22, // Grande
    xl: 28, // Extra grande
    xxl: 36, // Para títulos importantes
    xxxl: 48, // Para elementos de destaque
  },
  
  // Pesos de fonte
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Espaçamento entre linhas otimizado
  lineHeight: {
    tight: 1.2,
    normal: 1.4, // Mínimo para acessibilidade
    relaxed: 1.6, // Melhor para leitura
    loose: 1.8, // Para textos longos
  },
  
  // Espaçamento entre letras
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05, // Para melhor legibilidade
  },
  
  // Famílias de fonte
  fontFamily: {
    // Fontes mais legíveis para baixa visão
    system: 'System',
    readable: 'Arial', // Boa para dyslexia
    monospace: 'Courier New',
  },
};

// Estilos de texto predefinidos
export const TEXT_STYLES = {
  // Títulos
  title_large: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  
  title_medium: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
  },
  
  title_small: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
  },
  
  // Texto do corpo
  body_large: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  body_medium: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
  
  body_small: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
  
  // Botões
  button_large: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  button_medium: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  
  // Legendas e labels
  caption: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
};

// Configurações específicas para acessibilidade
export const ACCESSIBILITY_TEXT = {
  // Texto para leitores de tela
  screenReader: {
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
  
  // Texto de alto contraste
  highContrast: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.loose,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
  
  // Texto para baixa visão
  lowVision: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.loose,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
};