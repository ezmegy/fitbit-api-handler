'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var FitbitApiException = require('../exceptions/FitbitApiException.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function tryParseJson(json) {
  try {
    return JSON.parse(json);
  } catch {
    return json;
  }
}

class ResponseProcessor {
  async processResponse(response, request) {
    const {
      data
    } = response;
    const processedData = typeof data === 'string' ? tryParseJson(data) : data;

    const processedResponse = _objectSpread(_objectSpread({}, response), {}, {
      data: processedData
    });

    if (typeof processedData === 'object' && processedData.errors) {
      throw new FitbitApiException(processedResponse, request);
    }

    return processedResponse;
  }

}

module.exports = ResponseProcessor;
