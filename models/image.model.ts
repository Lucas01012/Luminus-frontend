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