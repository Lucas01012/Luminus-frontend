import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';

class SpeechService {
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private audioInitialized: boolean = false;

  // Inicializa configurações de áudio
  private async initializeAudio(): Promise<void> {
    if (this.audioInitialized) return;
    
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        allowsRecordingIOS: false,
      });
      
      this.audioInitialized = true;
    } catch (error) {
      // Silencioso
    }
  }


  async speak(
    text: string,
    options?: {
      language?: string;
      pitch?: number;
      rate?: number;
      onDone?: () => void;
      onStart?: () => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    try {
      await this.initializeAudio();
      await this.stop();

      this.isSpeaking = true;
      this.isPaused = false;

      if (Platform.OS === 'android') {
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      const speechOptions: Speech.SpeechOptions = {
        language: options?.language || 'pt-BR',
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 0.9,
        volume: 1.0,
        onStart: () => {
          this.isSpeaking = true;
          options?.onStart?.();
        },
        onDone: () => {
          this.isSpeaking = false;
          this.isPaused = false;
          options?.onDone?.();
        },
        onStopped: () => {
          this.isSpeaking = false;
          this.isPaused = false;
        },
        onError: (error) => {
          this.isSpeaking = false;
          this.isPaused = false;
          options?.onError?.(new Error(String(error)));
        },
      };

      if (Platform.OS === 'android') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      Speech.speak(text, speechOptions);
      
    } catch (error) {
      this.isSpeaking = false;
      this.isPaused = false;
      throw error;
    }
  }


  async stop(): Promise<void> {
    if (this.isSpeaking) {
      await Speech.stop();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }

  async pause(): Promise<void> {
    if (this.isSpeaking && !this.isPaused) {
      await Speech.pause();
      this.isPaused = true;
    }
  }

  async resume(): Promise<void> {
    if (this.isSpeaking && this.isPaused) {
      await Speech.resume();
      this.isPaused = false;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      return [];
    }
  }

  async getPortugueseVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.filter(
        (voice) =>
          voice.language.startsWith('pt-') || voice.language === 'pt'
      );
    } catch (error) {
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await Speech.isSpeakingAsync();
      return true;
    } catch (error) {
      return false;
    }
  }

  async speakLongText(
    text: string,
    options?: {
      language?: string;
      pitch?: number;
      rate?: number;
      maxChunkSize?: number;
      onProgress?: (current: number, total: number) => void;
      onDone?: () => void;
    }
  ): Promise<void> {
    const maxSize = options?.maxChunkSize || 4000;
    const chunks = this.splitTextIntoChunks(text, maxSize);

    for (let i = 0; i < chunks.length; i++) {
      options?.onProgress?.(i + 1, chunks.length);

      await new Promise<void>((resolve, reject) => {
        this.speak(chunks[i], {
          language: options?.language,
          pitch: options?.pitch,
          rate: options?.rate,
          onDone: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    }

    options?.onDone?.();
  }

  private splitTextIntoChunks(text: string, maxSize: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxSize) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }
}

export const speechService = new SpeechService();
export default speechService;
