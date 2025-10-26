import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ViewProps,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  headerActions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  padding = 'medium',
  headerActions,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.backgroundCard,
    };

    // Variantes
    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        };
      default:
        return baseStyle;
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.xl;
      default:
        return theme.spacing.md;
    }
  };

  const cardStyle = [getCardStyle(), style];
  const contentPadding = getPadding();

  return (
    <View style={cardStyle} {...props}>
      {(title || subtitle || headerActions) && (
        <View style={[
          styles.header,
          { 
            paddingHorizontal: contentPadding,
            paddingTop: contentPadding,
            paddingBottom: title || subtitle ? theme.spacing.sm : 0,
          }
        ]}>
          <View style={styles.headerContent}>
            {title && (
              <Text 
                style={[
                  styles.title,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.bold,
                  }
                ]}
                accessibilityRole="header"
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text 
                style={[
                  styles.subtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    marginTop: theme.spacing.xs,
                  }
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {headerActions && (
            <View style={styles.headerActions}>
              {headerActions}
            </View>
          )}
        </View>
      )}
      
      <View style={{ padding: contentPadding }}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  headerActions: {
    marginLeft: 16,
  },
  title: {
    lineHeight: 24,
  },
  subtitle: {
    lineHeight: 20,
  },
});