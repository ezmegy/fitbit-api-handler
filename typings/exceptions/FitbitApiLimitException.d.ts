import { Duration } from 'luxon';
import FitbitApiException from './FitbitApiException';
export default class FitbitApiLimitException extends FitbitApiException {
    retryIn(): Duration;
}
