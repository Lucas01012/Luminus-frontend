export interface TTSResponse {
  audio_content?: string;
  processing_time?: number;
  erro?: string;
}

export interface VoicesResponse {
  vozes: Array<{
    name: string;
    language_code: string;
    gender: string;
  }>;
  erro?: string;
}