import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { HapticPattern } from '@/constants/accessibilityDesign';

let hapticsEnabled = true;

export const setHapticsEnabled = (enabled: boolean) => {
  hapticsEnabled = enabled;
};

export const triggerHaptic = async (pattern: HapticPattern) => {
  if (Platform.OS === 'web' || !hapticsEnabled) return;

  try {
    switch (pattern) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch (error) {
    console.warn('Haptic feedback error:', error);
  }
};

export const triggerLight = () => triggerHaptic('light');
export const triggerMedium = () => triggerHaptic('medium');
export const triggerHeavy = () => triggerHaptic('heavy');
export const triggerSuccess = () => triggerHaptic('success');
export const triggerWarning = () => triggerHaptic('warning');
export const triggerError = () => triggerHaptic('error');
export const triggerSelection = () => triggerHaptic('selection');

export const triggerTap = () => triggerLight();
export const triggerPress = () => triggerMedium();
export const triggerLongPress = () => triggerHeavy();
export const triggerNotification = () => triggerMedium();
export const triggerFocus = () => triggerSelection();

export const triggerSuccessPattern = async () => {
  if (Platform.OS === 'web' || !hapticsEnabled) return;
  await triggerSuccess();
  setTimeout(() => triggerLight(), 100);
};

export const triggerErrorPattern = async () => {
  if (Platform.OS === 'web' || !hapticsEnabled) return;
  await triggerError();
  setTimeout(() => triggerMedium(), 80);
  setTimeout(() => triggerMedium(), 160);
};

export const triggerWarningPattern = async () => {
  if (Platform.OS === 'web' || !hapticsEnabled) return;
  await triggerWarning();
  setTimeout(() => triggerLight(), 120);
};
