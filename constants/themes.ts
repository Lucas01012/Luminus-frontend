export type ThemeMode = 'light' | 'dark' | 'highContrast';

export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderFocus: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    shadow: string;
  };
  opacity: {
    disabled: number;
    overlay: number;
    pressed: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    full: number;
  };
  shadows: {
    small: any;
    medium: any;
    large: any;
  };
}

const LIGHT_THEME: Theme = {
  colors: {
    primary: '#0066CC',
    primaryDark: '#004D99',
    primaryLight: '#3385D6',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    text: '#000000',
    textSecondary: '#333333',
    textTertiary: '#666666',
    border: '#CCCCCC',
    borderFocus: '#0066CC',
    success: '#00A651',
    error: '#D32F2F',
    warning: '#F57C00',
    info: '#1976D2',
    shadow: '#000000',
  },
  opacity: {
    disabled: 0.4,
    overlay: 0.5,
    pressed: 0.8,
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
    full: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

const DARK_THEME: Theme = {
  colors: {
    primary: '#4A9EFF',
    primaryDark: '#2D7FD9',
    primaryLight: '#6BB3FF',
    background: '#000000',
    surface: '#1A1A1A',
    surfaceElevated: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textTertiary: '#B0B0B0',
    border: '#444444',
    borderFocus: '#4A9EFF',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    shadow: '#000000',
  },
  opacity: {
    disabled: 0.4,
    overlay: 0.7,
    pressed: 0.8,
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
    full: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.7,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

const HIGH_CONTRAST_THEME: Theme = {
  colors: {
    primary: '#FFFF00',
    primaryDark: '#CCCC00',
    primaryLight: '#FFFF66',
    background: '#000000',
    surface: '#000000',
    surfaceElevated: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#FFFFFF',
    textTertiary: '#FFFF00',
    border: '#FFFFFF',
    borderFocus: '#FFFF00',
    success: '#00FF00',
    error: '#FF0000',
    warning: '#FFFF00',
    info: '#00FFFF',
    shadow: '#000000',
  },
  opacity: {
    disabled: 0.5,
    overlay: 0.9,
    pressed: 0.9,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    full: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const THEMES: Record<ThemeMode, Theme> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
  highContrast: HIGH_CONTRAST_THEME,
};

export const getTheme = (mode: ThemeMode): Theme => THEMES[mode];
