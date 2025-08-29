export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.183:5000',
  TTS_BASE_URL: 'http://192.168.0.183:5001', // Assumindo que TTS roda em porta diferente
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