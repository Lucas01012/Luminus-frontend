import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/src/theme/ThemeProvider';
import { useSpeech } from '@/src/hooks';

interface SpeechButtonProps {
  text: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
  onStart?: () => void;
  onStop?: () => void;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  size = 24,
  color,
  style,
  disabled = false,
  onStart,
  onStop,
}) => {
  const { theme } = useTheme();
  const { speak, stop, isSpeaking } = useSpeech({ autoStop: true });

  const handlePress = async () => {
    if (isSpeaking) {
      await stop();
      onStop?.();
    } else {
      onStart?.();
      await speak(text);
    }
  };

  const iconColor = color || theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || !text}
      style={[styles.button, style]}
      accessibilityLabel={
        isSpeaking ? 'Parar de ler' : 'Ler texto em voz alta'
      }
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || !text }}
    >
      <FontAwesome
        name={isSpeaking ? 'stop-circle' : 'volume-up'}
        size={size}
        color={disabled || !text ? theme.colors.textSecondary : iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
