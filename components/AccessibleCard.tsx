import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { INTERACTIVE_SPACING, DIMENSIONS } from '@/constants/spacing';

interface AccessibleCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  variant = 'default',
  padding = 'medium',
  style,
}) => {
  const cardStyle: ViewStyle = {
    ...styles.baseCard,
    ...styles[variant],
    ...styles[`${padding}Padding`],
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View 
      style={cardStyle}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: 12,
    marginVertical: 8,
  },
  
  default: {
    backgroundColor: COLORS.background.tertiary,
  },
  
  elevated: {
    backgroundColor: COLORS.background.tertiary,
    shadowColor: COLORS.background.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.interactive.border,
  },
  
  smallPadding: {
    padding: INTERACTIVE_SPACING.buttonPaddingSmall,
  },
  
  mediumPadding: {
    padding: INTERACTIVE_SPACING.buttonPaddingMedium,
  },
  
  largePadding: {
    padding: INTERACTIVE_SPACING.buttonPaddingLarge,
  },
});