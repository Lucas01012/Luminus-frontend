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
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadPreferences();
    preloadSound();
    
    // Cleanup do som ao desmontar
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);

  const preloadSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
      });

      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/click.mp3'),
        { shouldPlay: false, volume: 0.8 }
      );
      
      setSoundObject(sound);
    } catch (error) {
      console.log('Erro ao pré-carregar som:', error);
    }
  };

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
      if (soundObject) {
        // Reinicia a posição para tocar do início
        await soundObject.setPositionAsync(0);
        await soundObject.playAsync();
      } else {
        // Fallback se o som não foi pré-carregado
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('Erro no playSound:', error);
    }
  }, [soundObject]);

  const triggerFeedback = useCallback(async (
    type: FeedbackType, 
    options: FeedbackOptions = {}
  ) => {
    const { vibrate = true, sound = true } = options;

    try {
      if (vibrate && isVibrationEnabled) {
        await triggerVibration(type);
      }

      if (sound && isSoundEnabled) {
        await playSound(type);
      }
    } catch (error) {
      // Silenciosamente ignora erros
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
