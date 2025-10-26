import React from 'react';
import { 
  TextInput, 
  TextInputProps, 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  size = 'medium',
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getInputStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
    };

    // Tamanhos
    switch (size) {
      case 'small':
        baseStyle.minHeight = 40;
        baseStyle.paddingHorizontal = theme.spacing.sm;
        break;
      case 'large':
        baseStyle.minHeight = 56;
        baseStyle.paddingHorizontal = theme.spacing.lg;
        break;
      default:
        baseStyle.minHeight = 48;
        baseStyle.paddingHorizontal = theme.spacing.md;
    }

    // Variantes
    switch (variant) {
      case 'filled':
        baseStyle.backgroundColor = theme.colors.surface;
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = error ? theme.colors.error : theme.colors.outline;
        baseStyle.backgroundColor = theme.colors.background;
        break;
      default:
        baseStyle.borderBottomWidth = 1;
        baseStyle.borderBottomColor = error ? theme.colors.error : theme.colors.outline;
        baseStyle.backgroundColor = 'transparent';
    }

    return baseStyle;
  };

  const getTextInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: size === 'large' ? theme.typography.fontSize.lg : theme.typography.fontSize.md,
      color: theme.colors.text,
      paddingVertical: 0, // Remove padding padrão para melhor controle
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    };
  };

  const getHelperStyle = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.xs,
      color: error ? theme.colors.error : theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    };
  };

  const inputContainerStyle = [getInputStyle(), style as ViewStyle];
  const textInputStyle = getTextInputStyle();

  return (
    <View style={styles.container}>
      {label && (
        <Text 
          style={getLabelStyle()}
          accessibilityLabel={`${label} campo de entrada`}
        >
          {label}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={[styles.icon, { marginRight: theme.spacing.sm }]}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={textInputStyle}
          placeholderTextColor={theme.colors.textDisabled}
          accessibilityLabel={label || props.placeholder}
          accessibilityHint={helper}
          {...props}
        />
        
        {rightIcon && (
          <View style={[styles.icon, { marginLeft: theme.spacing.sm }]}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helper) && (
        <Text 
          style={getHelperStyle()}
          accessibilityLiveRegion={error ? 'assertive' : 'polite'}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});