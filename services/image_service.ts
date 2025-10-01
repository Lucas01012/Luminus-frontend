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
    processing_time?: number;
}

export interface GeminiResponse {
    objeto: string;
    confianca: null;
    processing_time?: number;
}

export type AnalisarResponse = VisionResponse | GeminiResponse | { erro: string };

export async function analisarImagem(imagemUri: string): Promise<AnalisarResponse> {
    try {
        // Validação
        if (!imagemUri) {
            return { erro: "Imagem não selecionada" };
        }

        console.log('📸 Analisando imagem...');
        
        const formData = new FormData();
        formData.append('imagem', {
            uri: imagemUri,
            type: 'image/jpeg',
            name: 'foto.jpg'
        } as any);

        const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALISAR}?modo=gemini`,
            formData,
            { 
                headers: { 'Content-Type': 'multipart/form-data' }, 
                timeout: API_CONFIG.TIMEOUT 
            }
        );

        console.log('✅ Análise concluída');
        return response.data as AnalisarResponse;

    } catch (error: any) {
        console.error('❌ Erro na análise:', error);
        
        if (error.code === 'ECONNABORTED') {
            return { erro: "Tempo limite excedido. Tente novamente." };
        }
        
        if (error.response?.status === 413) {
            return { erro: "Imagem muito grande. Escolha uma menor." };
        }
        
        if (!error.response) {
            return { erro: "Erro de conexão. Verifique sua internet." };
        }
        
        const serverError = error.response?.data?.erro;
        return { erro: serverError || "Erro ao processar imagem" };
    }
}

// Função para TTS
export function formatarParaTTS(resultado: AnalisarResponse): string {
    if ('erro' in resultado) {
        return `Erro: ${resultado.erro}`;
    }
    
    if ('objeto' in resultado) {
        return `Objeto detectado: ${resultado.objeto}`;
    }
    
    const labels = resultado.labels?.slice(0, 3) || [];
    if (labels.length === 0) {
        return "Nenhum objeto foi detectado na imagem.";
    }
    
    return "Objetos encontrados: " + labels.map(label => 
        `${label.objeto} com ${Math.round(label.confianca * 100)}% de confiança`
    ).join(", ");
}

// Verificar se há erro
export function temErro(resultado: AnalisarResponse): boolean {
    return 'erro' in resultado;
}

// Obter resumo curto
export function obterResumo(resultado: AnalisarResponse): string {
    if ('erro' in resultado) {
        return "Erro";
    }
    
    if ('objeto' in resultado) {
        return resultado.objeto;
    }
    
    return resultado.labels?.[0]?.objeto || "Sem resultado";
}