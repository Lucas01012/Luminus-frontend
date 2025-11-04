import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  AccessibilityRole,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  style,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Tamanhos
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.paddingHorizontal = theme.spacing.md;
        baseStyle.minHeight = 40;
        break;
      case 'large':
        baseStyle.paddingVertical = theme.spacing.lg;
        baseStyle.paddingHorizontal = theme.spacing.xl;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.paddingHorizontal = theme.spacing.lg;
        baseStyle.minHeight = 48;
    }

    // Largura
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Variantes
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = disabled ? theme.colors.outline : theme.colors.primary;
        // Borda de foco visível ao pressionar
        if (isPressed && !disabled) {
          baseStyle.borderWidth = 3;
          baseStyle.borderColor = theme.colors.primaryLight;
        }
        break;
      case 'secondary':
        baseStyle.backgroundColor = disabled ? theme.colors.outline : theme.colors.secondary;
        if (isPressed && !disabled) {
          baseStyle.borderWidth = 3;
          baseStyle.borderColor = theme.colors.secondaryLight;
        }
        break;
      case 'outline':
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = disabled ? theme.colors.outline : theme.colors.primary;
        baseStyle.backgroundColor = 'transparent';
        // Feedback: preencher com cor ao pressionar
        if (isPressed && !disabled) {
          baseStyle.backgroundColor = `${theme.colors.primary}20`;
          baseStyle.borderWidth = 3;
        }
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        // Feedback: fundo sutil ao pressionar
        if (isPressed && !disabled) {
          baseStyle.backgroundColor = `${theme.colors.primary}15`;
          baseStyle.borderWidth = 2;
          baseStyle.borderColor = theme.colors.primary;
        }
        break;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: theme.typography.fontWeight.semibold,
    };

    // Tamanhos de texto
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = theme.typography.fontSize.sm;
        break;
      case 'large':
        baseTextStyle.fontSize = theme.typography.fontSize.lg;
        break;
      default:
        baseTextStyle.fontSize = theme.typography.fontSize.md;
    }

    // Cores do texto baseadas na variante
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseTextStyle.color = disabled ? theme.colors.textDisabled : theme.colors.textInverse;
        break;
      case 'outline':
        baseTextStyle.color = disabled ? theme.colors.textDisabled : theme.colors.primary;
        break;
      case 'ghost':
        baseTextStyle.color = disabled ? theme.colors.textDisabled : theme.colors.text;
        break;
    }

    return baseTextStyle;
  };

  const buttonStyle = [getButtonStyle(), style];
  const textStyle = getTextStyle();

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      {...props}
    >
      {icon && (
        <Text style={[textStyle, { marginRight: theme.spacing.sm }]}>
          {icon}
        </Text>
      )}
      <Text style={textStyle}>
        {loading ? 'Carregando...' : title}
      </Text>
    </TouchableOpacity>
  );
};