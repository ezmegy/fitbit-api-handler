export interface HeartRateProcessedResponse {
    heartData: ApiHeartRateTransformed[]
}

export interface HeartRateIntradayProcessedResponse {
    heartData: ApiHeartRateTransformed[]
    heartIntradayData: ApiHeartRateIntradayEntry[]
}

export interface ApiHeartRate {
    dateTime: string
    value: ApiHeartRateValue
}

export interface ApiHeartRateValue {
    customHeartRateZones: ApiHeartRateZone[]
    heartRateZones: ApiHeartRateZone[]
    restingHeartRate: number
}

export interface ApiHeartRateZone {
    caloriesOut: number
    max: number
    min: number
    minutes: number
    name: string
}

export interface ApiHeartRateIntraday {
    dataset: ApiHeartRateIntradayEntry[]
}

export interface ApiHeartRateIntradayEntry {
    time: string
    value: number
}

export interface ApiHeartRateTransformed {
    dateTime: string
    customHeartRateZones: ApiHeartRateZone[]
    heartRateZones: ApiHeartRateZone[]
    restingHeartRate: number
}