// @flow
export type Activity = {
    activeDuration?: number,
    activityLevel?: Array<*>,
    activityName?: string,
    name?: string,
    activityTypeId: number,
    activityParentId?: number,
    activityParentName?: string,
    averageHeartRate: number,
    calories: number,
    caloriesLink: string,
    distance: number,
    distanceUnit: string,
    duration: number,
    elevationGain: number,
    heartRateLink: string,
    heartRateZones: Array<*>,
    lastModified: string,
    logId: number,
    logType: string,
    manualValuesSpecified: Object,
    originalDuration: number,
    originalStartTime: string,
    pace: number,
    source: Object,
    speed: number,
    startTime: string,
    steps: number,
    tcxLink: string,
};
