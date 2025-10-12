import { Audio } from 'expo-av';
import { AccessibilityInfo } from 'react-native';

type SoundType = 'click' | 'success' | 'error' | 'warning' | 'notification';

const soundCache: Record<string, Audio.Sound | null> = {};

export const playSound = async (type: SoundType) => {
  try {
    const sound = new Audio.Sound();

    const soundFiles: Record<SoundType, any> = {
      click: null,
      success: null,
      error: null,
      warning: null,
      notification: null,
    };

    if (soundFiles[type]) {
      await sound.loadAsync(soundFiles[type]);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    }
  } catch (error) {
    console.warn('Sound playback error:', error);
  }
};

export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

export const speak = async (text: string, options?: { rate?: number; pitch?: number }) => {
  const Speech = await import('expo-speech');

  Speech.speak(text, {
    language: 'pt-BR',
    rate: options?.rate || 0.9,
    pitch: options?.pitch || 1.0,
  });
};

export const stopSpeaking = async () => {
  const Speech = await import('expo-speech');
  Speech.stop();
};
