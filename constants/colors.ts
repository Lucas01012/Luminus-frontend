export const COLORS = {
  primary: {
    main: '#FF9500',
    light: '#FFAD33',
    dark: '#CC7700',
    contrast: '#000000',
    surface: 'rgba(255, 149, 0, 0.12)',
  } as const,

  secondary: {
    main: '#00BFA5',
    light: '#1DE9B6',
    dark: '#00897B',
    contrast: '#000000',
    surface: 'rgba(0, 191, 165, 0.12)',
  } as const,

  background: {
    primary: '#0A0A0A',
    secondary: '#1A1A1A',
    tertiary: '#2A2A2A',
    elevated: '#353535',
    modal: 'rgba(0, 0, 0, 0.96)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  } as const,

  surface: {
    base: '#1A1A1A',
    level1: '#242424',
    level2: '#2E2E2E',
    level3: '#383838',
    variant: '#424242',
  } as const,

  text: {
    primary: '#FFFFFF',
    secondary: '#E0E0E0',
    tertiary: '#B0B0B0',
    disabled: '#666666',
    high_contrast: '#FFFF00',
    inverse: '#000000',
  } as const,

  status: {
    success: '#00E676',
    successDark: '#00C853',
    error: '#FF5252',
    errorDark: '#D50000',
    warning: '#FFB74D',
    warningDark: '#FF9800',
    info: '#40C4FF',
    infoDark: '#00B0FF',
  } as const,

  features: {
    image: '#FF9500',
    imageSurface: 'rgba(255, 149, 0, 0.15)',
    libras: '#00E676',
    librasSurface: 'rgba(0, 230, 118, 0.15)',
    audio: '#FF5252',
    audioSurface: 'rgba(255, 82, 82, 0.15)',
    file: '#40C4FF',
    fileSurface: 'rgba(64, 196, 255, 0.15)',
  } as const,

  interactive: {
    button_primary: '#FF9500',
    button_secondary: '#2A2A2A',
    button_tertiary: 'transparent',
    button_disabled: '#1A1A1A',
    hover: 'rgba(255, 255, 255, 0.08)',
    pressed: 'rgba(255, 255, 255, 0.12)',
    border: '#424242',
    border_focus: '#FF9500',
    ripple: 'rgba(255, 149, 0, 0.24)',
  } as const,

  accessibility: {
    focus_ring: '#FF9500',
    focus_ring_width: 3,
    selection: 'rgba(255, 149, 0, 0.4)',
    high_contrast_bg: '#000000',
    high_contrast_text: '#FFFF00',
    high_contrast_border: '#FFFFFF',
  } as const,
} as const;

export const GRADIENTS = {
  primary: ['#FF9500', '#CC7700'],
  secondary: ['#00BFA5', '#00897B'],
  dark: ['#0A0A0A', '#1A1A1A'],
  elevated: ['#2A2A2A', '#1A1A1A'],
  feature_image: ['#FF9500', '#FFB038'],
  feature_libras: ['#00E676', '#00C853'],
  feature_audio: ['#FF5252', '#D50000'],
  feature_file: ['#40C4FF', '#00B0FF'],
} as const;

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 12,
  },
  glow: {
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 0,
  },
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
} as const;

export const getColors = (highContrast: boolean = false) => {
  if (highContrast) {
    return {
      ...COLORS,
      primary: {
        ...COLORS.primary,
        main: '#FFFF00',
        light: '#FFFF66',
        dark: '#CCCC00',
      },
      background: {
        primary: '#000000',
        secondary: '#000000',
        tertiary: '#1A1A1A',
        elevated: '#2A2A2A',
        modal: 'rgba(0, 0, 0, 1)',
        overlay: 'rgba(0, 0, 0, 0.9)',
      },
      surface: {
        base: '#000000',
        level1: '#1A1A1A',
        level2: '#2A2A2A',
        level3: '#3A3A3A',
        variant: '#4A4A4A',
      },
      text: {
        primary: '#FFFF00',
        secondary: '#FFFFFF',
        tertiary: '#E0E0E0',
        disabled: '#999999',
        high_contrast: '#FFFF00',
        inverse: '#000000',
      },
      interactive: {
        ...COLORS.interactive,
        button_primary: '#FFFF00',
        border: '#FFFFFF',
        border_focus: '#FFFF00',
      },
    };
  }
  return COLORS;
};