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
  touchTarget: 48,

  touchTargetExpanded: 64,

  betweenButtons: SPACING.xl,
  betweenSections: SPACING.huge,

  buttonPaddingSmall: SPACING.lg,
  buttonPaddingMedium: SPACING.xl,
  buttonPaddingLarge: SPACING.xxl,
};

export const LAYOUT = {
  screenPadding: SPACING.xxl,
  screenPaddingLarge: SPACING.xxxl,

  containerPadding: SPACING.xl,
  cardPadding: SPACING.xxl,
  sectionPadding: SPACING.huge,

  headerHeight: 140,
  headerPadding: SPACING.xxl,

  tabBarHeight: 90,
  tabBarPadding: SPACING.lg,

  cardBorderRadius: 16,
  buttonBorderRadius: 12,
  imageBorderRadius: 16,

  separatorHeight: 2,
  separatorMargin: SPACING.xl,
};

export const DIMENSIONS = {
  imagePreview: {
    width: '100%',
    height: 280,
  },

  buttonHeight: {
    small: 48,
    medium: 56,
    large: 68,
  },

  iconSize: {
    small: 22,
    medium: 26,
    large: 36,
    xlarge: 56,
  },

  logo: {
    width: 90,
    height: 90,
  },

  inputHeight: 60,

  loadingSize: {
    small: 24,
    medium: 36,
    large: 52,
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