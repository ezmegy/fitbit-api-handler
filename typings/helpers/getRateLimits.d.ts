import { Duration } from 'luxon';
declare const getRateLimits: (headers: Headers) => {
    rateLimit: number | undefined;
    rateRemaining: number | undefined;
    rateReset: Duration | undefined;
};
export default getRateLimits;
