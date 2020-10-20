'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var FitbitException = require('./FitbitException.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);

class FitbitApiException extends FitbitException {
  constructor(response, request) {
    const {
      data
    } = response;
    super(data.errors ? data.errors.map(item => item.message).join(', ') : JSON.stringify(data));

    _defineProperty__default['default'](this, "response", void 0);

    _defineProperty__default['default'](this, "request", void 0);

    this.response = response;
    this.request = request;
  }

  getErrors() {
    return this.response.data.errors;
  }

  hasError(error) {
    return !!this.getErrors().find(item => item.errorType === error);
  }

  getResponse() {
    return this.response;
  }

  getRequest() {
    return this.request;
  }

}

module.exports = FitbitApiException;
