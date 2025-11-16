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
    console.log('🎤 SpeechButton: Botão pressionado', { 
      isSpeaking, 
      textLength: text?.length,
      hasText: !!text 
    });

    if (isSpeaking) {
      console.log('🎤 SpeechButton: Parando fala...');
      await stop();
      onStop?.();
    } else {
      if (!text || text.trim().length === 0) {
        console.warn('🎤 SpeechButton: Texto vazio, não pode falar');
        return;
      }
      
      console.log('🎤 SpeechButton: Iniciando fala...', text.substring(0, 50));
      onStart?.();
      
      try {
        await speak(text);
        console.log('🎤 SpeechButton: Fala iniciada com sucesso');
      } catch (error) {
        console.error('🎤 SpeechButton: Erro ao falar:', error);
      }
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
