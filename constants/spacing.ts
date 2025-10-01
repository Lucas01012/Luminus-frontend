// Sistema de espaçamento otimizado para acessibilidade
export const SPACING = {
  // Espaçamentos base (multiplicados por 4px)
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

// Espaçamentos específicos para elementos interativos
export const INTERACTIVE_SPACING = {
  // Tamanho mínimo de toque (44pt conforme diretrizes de acessibilidade)
  touchTarget: 44,
  
  // Área de toque expandida para facilitar interação
  touchTargetExpanded: 56,
  
  // Espaçamento entre elementos interativos
  betweenButtons: SPACING.lg, // 16px mínimo
  betweenSections: SPACING.xxxl, // 32px
  
  // Padding interno de botões
  buttonPaddingSmall: SPACING.md, // 12px
  buttonPaddingMedium: SPACING.lg, // 16px
  buttonPaddingLarge: SPACING.xl, // 20px
};

// Layout e containers
export const LAYOUT = {
  // Margens da tela
  screenPadding: SPACING.xl, // 20px nas laterais
  screenPaddingLarge: SPACING.xxl, // 24px para telas maiores
  
  // Containers
  containerPadding: SPACING.lg, // 16px
  cardPadding: SPACING.xl, // 20px
  sectionPadding: SPACING.xxxl, // 32px
  
  // Headers
  headerHeight: 120, // Altura fixa do header
  headerPadding: SPACING.xl,
  
  // Navigation
  tabBarHeight: 80, // Altura da tab bar (maior para facilitar toque)
  tabBarPadding: SPACING.md,
  
  // Cards e elementos
  cardBorderRadius: 12,
  buttonBorderRadius: 8,
  imageBorderRadius: 12,
  
  // Separadores
  separatorHeight: 1,
  separatorMargin: SPACING.lg,
};

// Dimensões para elementos específicos
export const DIMENSIONS = {
  // Elementos de mídia
  imagePreview: {
    width: '100%',
    height: 240, // Altura maior para melhor visualização
  },
  
  // Botões
  buttonHeight: {
    small: 40,
    medium: 48, // Altura mínima recomendada
    large: 56,  // Mais fácil de tocar
  },
  
  // Ícones
  iconSize: {
    small: 20,
    medium: 24,
    large: 32,
    xlarge: 48, // Para elementos importantes
  },
  
  // Logo
  logo: {
    width: 80,  // Maior para melhor visibilidade
    height: 80,
  },
  
  // Input fields
  inputHeight: 52, // Maior para facilitar interação
  
  // Loading indicators
  loadingSize: {
    small: 20,
    medium: 32,
    large: 48,
  },
};

// Configurações para diferentes tamanhos de tela
export const BREAKPOINTS = {
  small: 320,
  medium: 768,
  large: 1024,
};

// Z-index para layering
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