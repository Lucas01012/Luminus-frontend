import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { HapticPattern } from '@/constants/accessibilityDesign';

export const triggerHaptic = async (pattern: HapticPattern) => {
  if (Platform.OS === 'web') return;

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

export const triggerSuccessPattern = async () => {
  if (Platform.OS === 'web') return;
  await triggerHaptic('success');
};

export const triggerErrorPattern = async () => {
  if (Platform.OS === 'web') return;
  await triggerHaptic('error');
};

export const triggerWarningPattern = async () => {
  if (Platform.OS === 'web') return;
  await triggerHaptic('warning');
};
