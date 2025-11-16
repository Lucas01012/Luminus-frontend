import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIBRATION_KEY = '@luminus_vibration_enabled';
const SOUND_KEY = '@luminus_sound_enabled';

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
}

interface FeedbackContextData {
  triggerFeedback: (type: FeedbackType, options?: FeedbackOptions) => Promise<void>;
  isVibrationEnabled: boolean;
  isSoundEnabled: boolean;
  toggleVibration: () => Promise<void>;
  toggleSound: () => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextData>({} as FeedbackContextData);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [vibration, sound] = await Promise.all([
        AsyncStorage.getItem(VIBRATION_KEY),
        AsyncStorage.getItem(SOUND_KEY),
      ]);

      if (vibration !== null) setIsVibrationEnabled(vibration === 'true');
      if (sound !== null) setIsSoundEnabled(sound === 'true');
    } catch (error) {
      console.warn('Erro ao carregar preferências de feedback:', error);
    }
  };

  const savePreferences = async (vibration: boolean, sound: boolean) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(VIBRATION_KEY, vibration.toString()),
        AsyncStorage.setItem(SOUND_KEY, sound.toString()),
      ]);
    } catch (error) {
      console.warn('Erro ao salvar preferências de feedback:', error);
    }
  };

  const triggerVibration = useCallback(async (type: FeedbackType) => {
    try {
      switch (type) {
        case FeedbackType.LIGHT:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case FeedbackType.MEDIUM:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case FeedbackType.HEAVY:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case FeedbackType.SUCCESS:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case FeedbackType.ERROR:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case FeedbackType.WARNING:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.warn('Erro ao executar vibração:', error);
    }
  }, []);

  const playSound = useCallback(async (type: FeedbackType) => {
    try {
      // Configura modo de áudio
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Usa expo-av para tocar um som curto
      // Por enquanto, desabilitado pois precisa de arquivo de áudio
      // Quando adicionar arquivos de som, descomentar aqui
      console.log('Som de feedback:', type);
    } catch (error) {
      console.warn('Erro ao reproduzir som:', error);
    }
  }, []);

  const triggerFeedback = useCallback(async (
    type: FeedbackType, 
    options: FeedbackOptions = {}
  ) => {
    const { vibrate = true, sound = false } = options;

    try {
      if (vibrate && isVibrationEnabled) {
        await triggerVibration(type);
      }

      if (sound && isSoundEnabled) {
        await playSound(type);
      }
    } catch (error) {
      console.warn('Erro ao executar feedback:', error);
    }
  }, [isVibrationEnabled, isSoundEnabled, triggerVibration, playSound]);

  const toggleVibration = useCallback(async () => {
    const newValue = !isVibrationEnabled;
    setIsVibrationEnabled(newValue);
    await savePreferences(newValue, isSoundEnabled);
    
    if (newValue) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [isVibrationEnabled, isSoundEnabled]);

  const toggleSound = useCallback(async () => {
    const newValue = !isSoundEnabled;
    setIsSoundEnabled(newValue);
    await savePreferences(isVibrationEnabled, newValue);
    
    if (newValue) {
      await playSound(FeedbackType.LIGHT);
    }
  }, [isVibrationEnabled, isSoundEnabled, playSound]);

  return (
    <FeedbackContext.Provider
      value={{
        triggerFeedback,
        isVibrationEnabled,
        isSoundEnabled,
        toggleVibration,
        toggleSound,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackContext deve ser usado dentro de um FeedbackProvider');
  }
  return context;
};
