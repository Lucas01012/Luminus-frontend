export const TYPOGRAPHY = {
  fontSize: {
    xs: 14, // Mínimo 14px para acessibilidade
    sm: 16, // Padrão aumentado
    md: 18, // Médio aumentado
    lg: 22, // Grande
    xl: 28, // Extra grande
    xxl: 36, // Para títulos importantes
    xxxl: 48, // Para elementos de destaque
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
    tight: 1.2,
    normal: 1.4, // Mínimo para acessibilidade
    relaxed: 1.6, // Melhor para leitura
    loose: 1.8, // Para textos longos
  },
  
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05, // Para melhor legibilidade
  },
  
  fontFamily: {
    system: 'System',
    readable: 'Arial',
    monospace: 'Courier New',
  },
};

export const TEXT_STYLES = {
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
  
  button_large: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  button_medium: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  
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

export const ACCESSIBILITY_TEXT = {
  screenReader: {
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
  
  highContrast: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.loose,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
  
  lowVision: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.loose,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
};