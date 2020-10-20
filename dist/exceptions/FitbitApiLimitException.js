'use strict';

var FitbitApiException = require('./FitbitApiException.js');
var getRateLimits = require('../helpers/getRateLimits.js');

class FitbitApiLimitException extends FitbitApiException {
  retryIn() {
    const {
      rateReset
    } = getRateLimits(this.getResponse().source.headers);
    return rateReset;
  }

}

module.exports = FitbitApiLimitException;
