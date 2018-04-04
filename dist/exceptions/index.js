'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class FitbitException extends Error {
    constructor(message) {
        super(`Fitbit Error: ${message}`);
    }
}

class FitbitApiException extends FitbitException {

    constructor(response, request) {
        super(JSON.stringify(response.data));
        this.response = response;
        this.request = request;
    }
}

exports.FitbitException = FitbitException;
exports.FitbitApiException = FitbitApiException;
