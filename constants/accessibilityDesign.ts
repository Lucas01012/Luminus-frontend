export const FONT_SIZES = {
  small: {
    heading1: 24,
    heading2: 20,
    heading3: 18,
    body: 16,
    caption: 14,
    button: 16,
  },
  medium: {
    heading1: 32,
    heading2: 26,
    heading3: 22,
    body: 18,
    caption: 16,
    button: 18,
  },
  large: {
    heading1: 40,
    heading2: 32,
    heading3: 26,
    body: 22,
    caption: 18,
    button: 22,
  },
  extraLarge: {
    heading1: 48,
    heading2: 38,
    heading3: 30,
    body: 26,
    caption: 22,
    button: 26,
  },
};

export type FontSizeOption = keyof typeof FONT_SIZES;

export const TOUCH_TARGET_SIZES = {
  minimum: 48,
  comfortable: 56,
  large: 68,
  extraLarge: 80,
};

export const SPACING_SCALE = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2.0,
};

export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
};

export const HAPTIC_PATTERNS = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
  selection: 'selection',
} as const;

export type HapticPattern = keyof typeof HAPTIC_PATTERNS;
