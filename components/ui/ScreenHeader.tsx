import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SPACING_SCALE } from '@/constants/accessibilityDesign';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, icon }) => {
  const { theme, getFontSize } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
    >
      {icon && (
        <View style={styles.iconContainer} accessible={false}>
          {icon}
        </View>
      )}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontSize: getFontSize('heading1'),
            },
          ]}
          accessible={false}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: getFontSize('body'),
              },
            ]}
            accessible={false}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING_SCALE.lg,
    paddingTop: SPACING_SCALE.xl,
    paddingBottom: SPACING_SCALE.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING_SCALE.md,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '500',
    textAlign: 'center',
  },
});
