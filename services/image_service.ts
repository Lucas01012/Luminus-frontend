import axios from "axios";
import { API_CONFIG } from "@/constants/config";
export interface VisionLabel {
    objeto: string;
    confianca: number;
}

export interface WebEntity {
    descricao: string;
    score: number;
}

export interface VisionResponse {
    labels: VisionLabel[];
    web_entities: WebEntity[];
    processing_time?:number;
}

export interface GeminiResponse {
    objeto: string;
    confianca: null;
    processing_time?: number;
}

export type AnalisarResponse = VisionResponse | GeminiResponse | { erro: string };

export async function analisarImagem(imagemUri: string): Promise<AnalisarResponse> {
    const formData = new FormData();

    formData.append('imagem',{
        uri: imagemUri,
        type:'image/jpeg',
        name:'foto.jpg'
    }as any);

    const response = await axios.post(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALISAR}?modo=gemini`,
    formData,
    {headers: {'Content-Type':'multipart/form-data'}, timeout: API_CONFIG.TIMEOUT}
    );
    return response.data as AnalisarResponse;
}