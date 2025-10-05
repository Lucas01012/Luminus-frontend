export const SPACING = {
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 12,  // 12px
  lg: 16,  // 16px
  xl: 20,  // 20px
  xxl: 24, // 24px
  xxxl: 32, // 32px
  huge: 48, // 48px - para separação de seções
  massive: 64, // 64px - para elementos importantes
};

export const INTERACTIVE_SPACING = {
  touchTarget: 44,
  
  touchTargetExpanded: 56,
  
  betweenButtons: SPACING.lg, // 16px mínimo
  betweenSections: SPACING.xxxl, // 32px
  
  buttonPaddingSmall: SPACING.md, // 12px
  buttonPaddingMedium: SPACING.lg, // 16px
  buttonPaddingLarge: SPACING.xl, // 20px
};

export const LAYOUT = {
  screenPadding: SPACING.xl, // 20px nas laterais
  screenPaddingLarge: SPACING.xxl, // 24px para telas maiores
  
  containerPadding: SPACING.lg, // 16px
  cardPadding: SPACING.xl, // 20px
  sectionPadding: SPACING.xxxl, // 32px
  
  headerHeight: 120, // Altura fixa do header
  headerPadding: SPACING.xl,
  
  tabBarHeight: 80, // Altura da tab bar (maior para facilitar toque)
  tabBarPadding: SPACING.md,
  
  cardBorderRadius: 12,
  buttonBorderRadius: 8,
  imageBorderRadius: 12,
  
  separatorHeight: 1,
  separatorMargin: SPACING.lg,
};

export const DIMENSIONS = {
  imagePreview: {
    width: '100%',
    height: 240,
  },
  
  buttonHeight: {
    small: 40,
    medium: 48,
    large: 56,
  },
  
  iconSize: {
    small: 20,
    medium: 24,
    large: 32,
    xlarge: 48,
  },
  
  logo: {
    width: 80,
    height: 80,
  },
  
  inputHeight: 52,
  
  loadingSize: {
    small: 20,
    medium: 32,
    large: 48,
  },
};

export const BREAKPOINTS = {
  small: 320,
  medium: 768,
  large: 1024,
};

export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};