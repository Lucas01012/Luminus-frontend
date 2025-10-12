import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';
import { playSound, announceForAccessibility } from '@/utils/audio';
import { TOUCH_TARGET_SIZES } from '@/constants/accessibilityDesign';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  style,
}) => {
  const { theme, hapticsEnabled, soundEnabled, getFontSize } = useTheme();

  const handlePress = async () => {
    if (disabled || loading) return;

    if (hapticsEnabled) {
      await triggerHaptic('medium');
    }

    if (soundEnabled) {
      await playSound('click');
    }

    announceForAccessibility(accessibilityLabel || title);
    onPress();
  };

  const getHeightForSize = () => {
    switch (size) {
      case 'small':
        return TOUCH_TARGET_SIZES.minimum;
      case 'medium':
        return TOUCH_TARGET_SIZES.comfortable;
      case 'large':
        return TOUCH_TARGET_SIZES.large;
      default:
        return TOUCH_TARGET_SIZES.comfortable;
    }
  };

  const buttonStyle: ViewStyle[] = [
    styles.button,
    {
      backgroundColor:
        variant === 'primary'
          ? theme.colors.primary
          : variant === 'danger'
          ? theme.colors.error
          : variant === 'outline'
          ? 'transparent'
          : theme.colors.surface,
      borderColor:
        variant === 'outline' ? theme.colors.primary : 'transparent',
      borderWidth: variant === 'outline' ? 3 : 0,
      minHeight: getHeightForSize(),
      opacity: disabled ? theme.opacity.disabled : 1,
      borderRadius: theme.borderRadius.medium,
      ...theme.shadows.medium,
    },
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyle: TextStyle = {
    color:
      variant === 'primary' || variant === 'danger'
        ? '#FFFFFF'
        : variant === 'outline'
        ? theme.colors.primary
        : theme.colors.text,
    fontSize: getFontSize('button'),
    fontWeight: '700',
    letterSpacing: 0.5,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
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
          color={
            variant === 'primary' || variant === 'danger'
              ? '#FFFFFF'
              : theme.colors.primary
          }
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={textStyle}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
});
