import { DateTime } from 'luxon';
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
export interface ApiWeightTransformed extends ApiWeight {
    dateTime: DateTime;
}
export interface WeightProcessedResponse {
    weight: ApiWeightTransformed[];
}
