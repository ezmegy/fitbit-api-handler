'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FitbitException = require('./exceptions/FitbitException.js');
var FitbitApiException = require('./exceptions/FitbitApiException.js');
var FitbitApiLimitException = require('./exceptions/FitbitApiLimitException.js');
var Activity = require('./models/Activity.js');
var Api = require('./api/Api.js');
var activityTypes = require('./constants/activity-types.js');
var intradayResources = require('./constants/intraday-resources.js');
var scopes = require('./constants/scopes.js');
var subscriptionCollections = require('./constants/subscription-collections.js');
var ApiSleep = require('./types/api/ApiSleep.js');



exports.FitbitException = FitbitException;
exports.FitbitApiException = FitbitApiException;
exports.FitbitApiLimitException = FitbitApiLimitException;
exports.Activity = Activity;
exports.Api = Api;
Object.defineProperty(exports, 'ActivityType', {
	enumerable: true,
	get: function () {
		return activityTypes.ActivityType;
	}
});
Object.defineProperty(exports, 'IntradayResource', {
	enumerable: true,
	get: function () {
		return intradayResources.IntradayResource;
	}
});
Object.defineProperty(exports, 'ApiScope', {
	enumerable: true,
	get: function () {
		return scopes.ApiScope;
	}
});
Object.defineProperty(exports, 'SubscriptionCollection', {
	enumerable: true,
	get: function () {
		return subscriptionCollections.SubscriptionCollection;
	}
});
Object.defineProperty(exports, 'ClassicSleepState', {
	enumerable: true,
	get: function () {
		return ApiSleep.ClassicSleepState;
	}
});
Object.defineProperty(exports, 'SleepType', {
	enumerable: true,
	get: function () {
		return ApiSleep.SleepType;
	}
});
Object.defineProperty(exports, 'StagesSleepState', {
	enumerable: true,
	get: function () {
		return ApiSleep.StagesSleepState;
	}
});
