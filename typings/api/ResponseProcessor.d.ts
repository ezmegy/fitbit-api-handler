import { ApiResponseType } from 'rest-api-handler';
export default class ResponseProcessor {
    processResponse(response: ApiResponseType<any>, request: Request): Promise<ApiResponseType<any>>;
}
