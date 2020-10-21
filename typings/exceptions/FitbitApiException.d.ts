import { ApiResponseType } from 'rest-api-handler';
import FitbitException from './FitbitException';
interface Error {
    errorType: string;
    fieldName: string;
    message: string;
}
export default class FitbitApiException extends FitbitException {
    private response;
    private request;
    constructor(response: ApiResponseType<any>, request: Request);
    getErrors(): Error[];
    hasError(error: string): boolean;
    getResponse(): ApiResponseType<any>;
    getRequest(): Request;
}
export {};
