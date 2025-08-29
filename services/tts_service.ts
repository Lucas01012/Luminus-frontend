import axios from 'axios';
import { API_CONFIG } from '@/constants/config';
import { TTSResponse, VoicesResponse } from '@/models/document.model';


export async function generateTextToSpeech(
  texto: string,
  voz: string = 'pt-BR-Wavenet-A',
  idioma: string = 'pt-BR'
): Promise<TTSResponse> {
  try {
    console.log('Gerando TTS:', { texto: texto.substring(0, 50) + '...', voz, idioma });

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TTS}`,
      {
        texto,
        voz,
        idioma
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    console.log('TTS gerado com sucesso');
    return response.data;

  } catch (error) {
    console.error('Erro ao gerar TTS:', error);
    return {
      erro: `Erro ao gerar áudio: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

export async function getAvailableVoices(): Promise<VoicesResponse> {
  try {
    console.log('Buscando vozes disponíveis');

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VOZES}`,
      {
        timeout: API_CONFIG.TIMEOUT
      }
    );

    console.log('Vozes carregadas:', response.data);
    return response.data;

  } catch (error) {
    console.error('Erro ao buscar vozes:', error);
    return {
      vozes: [],
      erro: `Erro ao buscar vozes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}
