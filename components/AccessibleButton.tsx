import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  AccessibilityRole 
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { TEXT_STYLES } from '@/constants/typography';
import { INTERACTIVE_SPACING, DIMENSIONS } from '@/constants/spacing';

interface AccessibleButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  accessibilityHint,
  accessibilityRole = 'button',
  disabled,
  style,
  ...props
}) => {
  const buttonStyle: ViewStyle = [
    styles.baseButton,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle: TextStyle = [
    styles.baseText,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      {...props}
      style={buttonStyle}
      disabled={disabled || loading}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.primary.contrast : COLORS.text.primary} 
        />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
    minHeight: INTERACTIVE_SPACING.touchTarget,
    minWidth: INTERACTIVE_SPACING.touchTarget,
    
    shadowColor: COLORS.background.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  small: {
    paddingHorizontal: INTERACTIVE_SPACING.buttonPaddingSmall,
    paddingVertical: INTERACTIVE_SPACING.buttonPaddingSmall,
    height: DIMENSIONS.buttonHeight.small,
  },
  
  medium: {
    paddingHorizontal: INTERACTIVE_SPACING.buttonPaddingMedium,
    paddingVertical: INTERACTIVE_SPACING.buttonPaddingMedium,
    height: DIMENSIONS.buttonHeight.medium,
  },
  
  large: {
    paddingHorizontal: INTERACTIVE_SPACING.buttonPaddingLarge,
    paddingVertical: INTERACTIVE_SPACING.buttonPaddingLarge,
    height: DIMENSIONS.buttonHeight.large,
  },
  
  primary: {
    backgroundColor: COLORS.primary.main,
  },
  
  secondary: {
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 2,
    borderColor: COLORS.interactive.border,
  },
  
  success: {
    backgroundColor: COLORS.status.success,
  },
  
  error: {
    backgroundColor: COLORS.status.error,
  },
  
  warning: {
    backgroundColor: COLORS.status.warning,
  },
  
  disabled: {
    backgroundColor: COLORS.interactive.button_disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  baseText: {
    textAlign: 'center',
    fontWeight: TEXT_STYLES.button_medium.fontWeight,
  },
  
  smallText: {
    fontSize: TEXT_STYLES.body_small.fontSize,
  },
  
  mediumText: {
    fontSize: TEXT_STYLES.button_medium.fontSize,
  },
  
  largeText: {
    fontSize: TEXT_STYLES.button_large.fontSize,
    letterSpacing: TEXT_STYLES.button_large.letterSpacing,
  },
  
  primaryText: {
    color: COLORS.primary.contrast,
  },
  
  secondaryText: {
    color: COLORS.text.primary,
  },
  
  successText: {
    color: COLORS.text.primary,
  },
  
  errorText: {
    color: COLORS.text.primary,
  },
  
  warningText: {
    color: COLORS.background.primary,
  },
  
  disabledText: {
    color: COLORS.text.disabled,
  },
});