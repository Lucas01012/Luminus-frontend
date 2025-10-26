import { useState, useCallback } from 'react';
// import * as Haptics from 'expo-haptics';

export enum FeedbackType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

export interface FeedbackOptions {
  vibrate?: boolean;
  sound?: boolean;
  duration?: number;
}

export function useFeedback() {
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const triggerFeedback = useCallback(async (
    type: FeedbackType, 
    options: FeedbackOptions = {}
  ) => {
    const { vibrate = true, sound = false } = options;

    try {
      // Feedback háptico (vibração)
      if (vibrate && isVibrationEnabled) {
        // Descomentado quando expo-haptics estiver instalado
        /*
        switch (type) {
          case FeedbackType.SUCCESS:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case FeedbackType.ERROR:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case FeedbackType.WARNING:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case FeedbackType.LIGHT:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case FeedbackType.MEDIUM:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case FeedbackType.HEAVY:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          default:
            await Haptics.selectionAsync();
        }
        */
        console.log(`🔊 Feedback: ${type}`);
      }

      // Feedback sonoro (quando implementado)
      if (sound && isSoundEnabled) {
        // TODO: Implementar feedback sonoro
        console.log(`🎵 Sound feedback: ${type}`);
      }
    } catch (error) {
      console.warn('Erro ao executar feedback:', error);
    }
  }, [isVibrationEnabled, isSoundEnabled]);

  const toggleVibration = useCallback(() => {
    setIsVibrationEnabled(prev => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  return {
    triggerFeedback,
    isVibrationEnabled,
    isSoundEnabled,
    toggleVibration,
    toggleSound,
  };
}