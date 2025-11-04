import { useState, useCallback } from 'react';

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
      if (vibrate && isVibrationEnabled) {
        // TODO: Implementar com expo-haptics quando instalado
      }

      if (sound && isSoundEnabled) {
        // TODO: Implementar feedback sonoro
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