export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.128:5000',
  ENDPOINTS: {
    ANALISAR: '/analisar',
    OCR: '/ler-texto',
    DOCUMENTO: '/documento/processar-documento',
    TTS: '/documento/gerar-audio-documento',
    VOZES: '/documento/vozes-disponiveis',
  },
  TIMEOUT: 30000,
};

export const SPEECH_CONFIG = {
  LANGUAGE: 'pt-BR',
  RATE: 0.8,
  PITCH: 1.0,
};