export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    VISION: '/imagem/vision',
    GEMINI: '/imagem/gemini',
  },
  TIMEOUT: 30000, // 30 seconds
};

export const SPEECH_CONFIG = {
  LANGUAGE: 'pt-BR',
  RATE: 0.8,
  PITCH: 1.0,
};