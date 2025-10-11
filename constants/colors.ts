export const COLORS = {
  primary: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
    contrast: '#000000',
  } as const,
  
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
    modal: 'rgba(0, 0, 0, 0.95)',
  } as const,
  
  text: {
    primary: '#FFFFFF',
    secondary: '#E8E8E8',
    tertiary: '#BDBDBD',
    disabled: '#757575',
    high_contrast: '#FFFF00',
  } as const,
  
  status: {
    success: '#00E676',
    error: '#FF5252',
    warning: '#FFB74D',
    info: '#40C4FF',
  } as const,
  
  features: {
    image: '#FFC107',
    libras: '#00E676',
    audio: '#FF5252',
    file: '#40C4FF',
  } as const,
  
  interactive: {
    button_primary: '#FFC107',
    button_secondary: '#424242',
    button_disabled: '#616161',
    border: '#9E9E9E',
    border_focus: '#FFC107',
    ripple: 'rgba(255, 193, 7, 0.3)',
  } as const,
  
  accessibility: {
    focus_ring: '#FFC107',
    selection: 'rgba(255, 193, 7, 0.4)',
    high_contrast_bg: '#000000',
    high_contrast_text: '#FFFF00',
  } as const,
} as const;

export const GRADIENTS = {
  primary: ['#FFC107', '#FFA000'],
  dark: ['#121212', '#1E1E1E'],
  feature: ['#2C2C2C', '#1E1E1E'],
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.95,
    shadowRadius: 16,
    elevation: 16,
  },
} as const;

// Função para obter cores baseadas no modo (normal/alto contraste)
export const getColors = (highContrast: boolean = false) => {
  if (highContrast) {
    return {
      ...COLORS,
      background: {
        primary: COLORS.accessibility.high_contrast_bg,
        secondary: '#000000',
        tertiary: '#333333',
        modal: 'rgba(0, 0, 0, 0.95)',
      },
      text: {
        primary: COLORS.accessibility.high_contrast_text,
        secondary: '#FFFFFF',
        tertiary: '#CCCCCC',
        disabled: '#888888',
        high_contrast: COLORS.accessibility.high_contrast_text,
      },
    };
  }
  return COLORS;
};