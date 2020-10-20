'use strict';

var luxon = require('luxon');

const getRateLimits = headers => {
  const rateLimit = headers.get('fitbit-rate-limit-limit');
  const rateRemaining = headers.get('fitbit-rate-limit-remaining');
  const rateReset = headers.get('fitbit-rate-limit-reset');
  return {
    rateLimit: rateLimit != null ? Number(rateLimit) : undefined,
    rateRemaining: rateRemaining != null ? Number(rateRemaining) : undefined,
    rateReset: rateReset != null ? luxon.Duration.fromObject({
      seconds: Number(rateReset)
    }) : undefined
  };
};

module.exports = getRateLimits;
