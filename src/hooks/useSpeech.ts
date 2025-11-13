import { useState, useEffect, useCallback } from 'react';
import { speechService } from '@/src/services';

export interface UseSpeechOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  autoStop?: boolean; // Para automaticamente quando o componente desmontar
}

export const useSpeech = (options?: UseSpeechOptions) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    checkAvailability();

    // Cleanup: para a fala quando o componente desmontar
    return () => {
      if (options?.autoStop !== false) {
        speechService.stop();
      }
    };
  }, []);

  const checkAvailability = async () => {
    const available = await speechService.isAvailable();
    setIsAvailable(available);
  };

  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      try {
        await speechService.speak(text, {
          language: options?.language || 'pt-BR',
          pitch: options?.pitch,
          rate: options?.rate,
          onStart: () => {
            setIsSpeaking(true);
            setIsPaused(false);
          },
          onDone: () => {
            setIsSpeaking(false);
            setIsPaused(false);
          },
          onError: (error) => {
            console.error('Speech error:', error);
            setIsSpeaking(false);
            setIsPaused(false);
          },
        });
      } catch (error) {
        console.error('Failed to speak:', error);
        setIsSpeaking(false);
        setIsPaused(false);
      }
    },
    [options?.language, options?.pitch, options?.rate]
  );

  const speakLongText = useCallback(
    async (
      text: string,
      onProgress?: (current: number, total: number) => void
    ) => {
      if (!text.trim()) return;

      try {
        setIsSpeaking(true);
        setIsPaused(false);

        await speechService.speakLongText(text, {
          language: options?.language || 'pt-BR',
          pitch: options?.pitch,
          rate: options?.rate,
          onProgress,
          onDone: () => {
            setIsSpeaking(false);
            setIsPaused(false);
          },
        });
      } catch (error) {
        console.error('Failed to speak long text:', error);
        setIsSpeaking(false);
        setIsPaused(false);
      }
    },
    [options?.language, options?.pitch, options?.rate]
  );

  const stop = useCallback(async () => {
    await speechService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(async () => {
    if (isSpeaking && !isPaused) {
      await speechService.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(async () => {
    if (isSpeaking && isPaused) {
      await speechService.resume();
      setIsPaused(false);
    }
  }, [isSpeaking, isPaused]);

  const toggle = useCallback(async () => {
    if (isSpeaking) {
      await stop();
    }
  }, [isSpeaking, stop]);

  return {
    speak,
    speakLongText,
    stop,
    pause,
    resume,
    toggle,
    isSpeaking,
    isPaused,
    isAvailable,
  };
};
