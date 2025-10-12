import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  elevated = true,
  padding = 'medium',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { theme, hapticsEnabled } = useTheme();

  const paddingValues = {
    none: 0,
    small: 16,
    medium: 20,
    large: 28,
  };

  const cardStyle: ViewStyle = {
    backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: paddingValues[padding],
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...(elevated ? theme.shadows.medium : {}),
    ...style,
  };

  const handlePress = async () => {
    if (onPress) {
      if (hapticsEnabled) {
        await triggerHaptic('light');
      }
      onPress();
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={handlePress}
        accessible={true}
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
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};
