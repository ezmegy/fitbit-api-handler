import { DateTime, Duration } from 'luxon';
import { Api as ApiBase, ApiResponseType } from 'rest-api-handler';
import { IntradayResource } from '../constants/intraday-resources';
import { ApiScope } from '../constants/scopes';
import { SubscriptionCollection } from '../constants/subscription-collections';
import { Activity } from '../models';
import { ApiActivity, ApiActivityFilters, ApiDateFilters, ApiToken } from '../types/api';
import { SingleDayProcessedResponse, SleepProcessedResponse } from '../types/api/ApiSleep';
declare type ResponseType = 'code' | 'token';
declare type Prompt = 'consent' | 'login' | 'login consent' | 'none';
declare type DetailLevel = '1sec' | '1min' | '15min';
export interface Pagination {
    afterDate?: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    sort: string;
}
export interface ActivityResponse {
    activities: Activity<number, ApiActivity>[];
    pagination: Pagination;
}
export interface IntradayResponse {
    sets: {
        time: DateTime;
        value: number;
    }[];
    total: number;
}
export interface SubscriptionResponse {
    collectionType: string;
    ownerId: string;
    ownerType: string;
    subscriberId: string;
    subscriptionId: string;
}
export interface ActivitySummaryResponse {
    activities: Activity[];
    goals: {
        caloriesOut: number;
        distance: number;
        floors: number;
        steps: number;
    };
    summary: {
        activityCalories: number;
        caloriesBMR: number;
        caloriesOut: number;
        distances: {
            activity: string;
            distance: number;
        }[];
        elevation: number;
        fairlyActiveMinutes: number;
        floors: number;
        lightlyActiveMinutes: number;
        marginalCalories: number;
        sedentaryMinutes: number;
        steps: number;
        veryActiveMinutes: number;
    };
}
export declare type Token = ApiToken & {
    expireDate: string;
};
export declare type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never;
export default class Api extends ApiBase<ApiResponseType<any>> {
    private clientId;
    private secret;
    private accessToken;
    private dateFormat;
    private timeFormat;
    private dateTimeFormat;
    private rateLimit?;
    private rateRemaining?;
    private rateReset?;
    constructor(clientId: string, secret: string);
    private fillRateLimits;
    getFillRateLimits(): {
        rateLimit: number | undefined;
        rateRemaining: number | undefined;
        rateReset: Duration | undefined;
    };
    request(...parameters: ArgumentsType<typeof ApiBase.prototype.request>): Promise<ApiResponseType<any>>;
    private getDateTimeString;
    setAccessToken(token: string): void;
    getAccessToken(): string | null;
    getLoginUrl(redirectUri: string, scope: ApiScope[], { responseType, prompt, expiresIn, state, }?: {
        expiresIn?: number;
        prompt?: Prompt;
        responseType?: ResponseType;
        state?: string;
    }): string;
    requestToken(parameters: Record<string, any>): Promise<Token>;
    requestAccessToken(code: string, redirectUri: string, expiresIn?: number, state?: string): Promise<ApiToken>;
    extendAccessToken(token: string, expiresIn?: number): Promise<ApiToken>;
    getApiUrl(namespace: string, userId?: string, version?: string, file?: string): string;
    getProfile(): Promise<any>;
    getIntradayData(resource: IntradayResource, from: DateTime, to?: DateTime, detail?: DetailLevel): Promise<IntradayResponse>;
    getActivitySummary(date: DateTime | string, userId?: string): Promise<ActivitySummaryResponse>;
    private processDateFilters;
    private requestSleepData;
    getSleep(date: DateTime): Promise<SingleDayProcessedResponse>;
    getSleeps(filters: ApiDateFilters): Promise<SleepProcessedResponse>;
    getActivity(activityId: number): Promise<Activity<number, ApiActivity>>;
    getActivityTcx(activityId: number): Promise<string>;
    getActivities(filters: ApiActivityFilters): Promise<ActivityResponse>;
    getActivitiesBetweenDates(from: DateTime, to: DateTime, limit?: number): Promise<ActivityResponse>;
    processActivities(filter: ApiActivityFilters, processor: (activity: Activity<number, ApiActivity>) => Promise<Activity>): Promise<Activity[]>;
    /**
     * https://dev.fitbit.com/build/reference/web-api/activity/#activity-logging
     *
     * @param activity
     * @returns {Promise<Activity>}
     */
    logActivity(activity: Activity): Promise<Activity<number, ApiActivity>>;
    requestSubscription(method: 'POST' | 'DELETE' | 'GET', collection?: SubscriptionCollection, id?: string, subscriberId?: number): Promise<Record<string, any>>;
    /**
     * https://dev.fitbit.com/build/reference/web-api/subscriptions/#adding-a-subscription
     *
     * @param id
     * @param collection
     * @param subscriberId
     * @returns {Promise<SubscriptionResponse>}
     */
    addSubscription(id: string, collection?: SubscriptionCollection, subscriberId?: number): Promise<SubscriptionResponse>;
    /**
     * https://dev.fitbit.com/build/reference/web-api/subscriptions/#deleting-a-subscription
     *
     * @param id
     * @param collection
     * @param subscriberId
     * @returns {Promise<Object>}
     */
    deleteSubscription(id: string, collection?: SubscriptionCollection, subscriberId?: number): Promise<Record<string, any>>;
    /**
     * https://dev.fitbit.com/build/reference/web-api/subscriptions/#getting-a-list-of-subscriptions
     *
     * @param collection
     * @returns {Promise<void>}
     */
    getSubscriptions(collection?: SubscriptionCollection): Promise<SubscriptionResponse[]>;
    verifyFitbitRequest(body: string, signature: string): boolean;
}
export {};
