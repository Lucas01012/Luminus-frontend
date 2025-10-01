// Sistema de cores otimizado para acessibilidade e baixa visão
export const COLORS = {
  // Cores primárias com alto contraste
  primary: {
    // Amarelo mais vibrante para melhor visibilidade
    main: '#FFB800', // Contraste 4.5:1 com fundo escuro
    light: '#FFCA28',
    dark: '#FF8F00',
    contrast: '#000000', // Texto sobre fundo amarelo
  } as const,
  
  // Cores de fundo otimizadas
  background: {
    primary: '#1A1A1A', // Preto mais suave que reduz fadiga ocular
    secondary: '#2D2D2D', // Cinza escuro com melhor contraste
    tertiary: '#404040', // Cinza médio para cards
    modal: 'rgba(0, 0, 0, 0.9)', // Modal com transparência
  } as const,
  
  // Texto com contraste otimizado
  text: {
    primary: '#FFFFFF', // Branco puro - contraste 21:1
    secondary: '#E0E0E0', // Cinza claro - contraste 15:1
    tertiary: '#B0B0B0', // Cinza médio - contraste 9:1
    disabled: '#808080', // Texto desabilitado
    high_contrast: '#FFFF00', // Amarelo para texto de destaque
  } as const,
  
  // Status e feedback
  status: {
    success: '#00E676', // Verde vibrante
    error: '#FF5252', // Vermelho vibrante
    warning: '#FFB74D', // Laranja claro
    info: '#29B6F6', // Azul claro
  } as const,
  
  // Cores temáticas por funcionalidade
  features: {
    image: '#FFB800', // Amarelo - mantém a identidade
    libras: '#00E676', // Verde vibrante para LIBRAS
    audio: '#FF5252', // Vermelho vibrante para áudio
    file: '#29B6F6', // Azul vibrante para arquivos
  } as const,
  
  // Elementos interativos
  interactive: {
    button_primary: '#FFB800',
    button_secondary: '#404040',
    button_disabled: '#666666',
    border: '#808080',
    border_focus: '#FFB800', // Borda de foco amarela
    ripple: 'rgba(255, 184, 0, 0.2)',
  } as const,
  
  // Acessibilidade específica
  accessibility: {
    focus_ring: '#FFB800', // Anel de foco visível
    selection: 'rgba(255, 184, 0, 0.3)', // Seleção de texto
    high_contrast_bg: '#000000', // Fundo para modo alto contraste
    high_contrast_text: '#FFFF00', // Texto em modo alto contraste
  } as const,
} as const;

// Gradientes otimizados
export const GRADIENTS = {
  primary: ['#FFB800', '#FF8F00'],
  dark: ['#1A1A1A', '#2D2D2D'],
  feature: ['#404040', '#2D2D2D'],
} as const;

// Sombras otimizadas para melhor definição
export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8, // Sombra mais forte
    shadowRadius: 4,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.9,
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