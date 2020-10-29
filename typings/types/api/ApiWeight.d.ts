export declare enum WeightSource {
    api = "API",
    aria = "Aria"
}
export interface ApiWeight {
    bmi: number;
    date: string;
    logId: number;
    time: string;
    weight: number;
    source: WeightSource;
}
export interface WeightProcessedResponse {
    weights: ApiWeight[];
}
