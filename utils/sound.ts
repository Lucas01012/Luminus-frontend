import { Audio } from 'expo-av';
import { Platform } from 'react-native';

type SoundType = 'tap' | 'success' | 'error' | 'warning' | 'notification' | 'focus';

const SOUND_FREQUENCIES: Record<SoundType, number> = {
  tap: 880,
  success: 1046,
  error: 440,
  warning: 880,
  notification: 1174,
  focus: 1318,
};

const SOUND_DURATIONS: Record<SoundType, number> = {
  tap: 50,
  success: 150,
  error: 200,
  warning: 120,
  notification: 100,
  focus: 80,
};

class SoundManager {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private enabled: boolean = true;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async playSound(type: SoundType) {
    if (!this.enabled || Platform.OS === 'web') {
      return;
    }

    try {
      const sound = new Audio.Sound();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const status = await sound.loadAsync(
        { uri: this.generateTone(SOUND_FREQUENCIES[type], SOUND_DURATIONS[type]) },
        { shouldPlay: true, volume: 0.5 }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  private generateTone(frequency: number, duration: number): string {
    return `data:audio/wav;base64,${this.createWaveData(frequency, duration)}`;
  }

  private createWaveData(frequency: number, duration: number): string {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration / 1000);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
      const envelope = Math.min(1, i / (sampleRate * 0.01), (numSamples - i) / (sampleRate * 0.01));
      view.setInt16(44 + i * 2, sample * envelope * 0x7FFF, true);
    }

    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

export const soundManager = new SoundManager();

export const playTapSound = () => soundManager.playSound('tap');
export const playSuccessSound = () => soundManager.playSound('success');
export const playErrorSound = () => soundManager.playSound('error');
export const playWarningSound = () => soundManager.playSound('warning');
export const playNotificationSound = () => soundManager.playSound('notification');
export const playFocusSound = () => soundManager.playSound('focus');
export const setSoundEnabled = (enabled: boolean) => soundManager.setEnabled(enabled);
