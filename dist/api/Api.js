'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var crypto = require('crypto');
var luxon = require('luxon');
var queryString = require('query-string');
var restApiHandler = require('rest-api-handler');
var FitbitApiException = require('../exceptions/FitbitApiException.js');
var getRateLimits = require('../helpers/getRateLimits.js');
var FitbitApiLimitException = require('../exceptions/FitbitApiLimitException.js');
var Activity = require('../models/Activity.js');
var ResponseProcessor = require('./ResponseProcessor.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function base64Encode(string) {
  if (typeof btoa !== 'undefined') {
    // eslint-disable-next-line no-undef
    return btoa(string);
  }

  return Buffer.from(string).toString('base64');
}

class Api extends restApiHandler.Api {
  constructor(clientId, secret) {
    super('https://api.fitbit.com', [new restApiHandler.DefaultResponseProcessor(FitbitApiException), new ResponseProcessor()]);

    _defineProperty__default['default'](this, "clientId", void 0);

    _defineProperty__default['default'](this, "secret", void 0);

    _defineProperty__default['default'](this, "accessToken", null);

    _defineProperty__default['default'](this, "dateFormat", 'yyyy-MM-dd');

    _defineProperty__default['default'](this, "timeFormat", 'HH:mm');

    _defineProperty__default['default'](this, "dateTimeFormat", `${this.dateFormat}'T'${this.timeFormat}`);

    _defineProperty__default['default'](this, "rateLimit", void 0);

    _defineProperty__default['default'](this, "rateRemaining", void 0);

    _defineProperty__default['default'](this, "rateReset", void 0);

    this.clientId = clientId;
    this.secret = secret;
  }

  fillRateLimits(headers) {
    const {
      rateLimit,
      rateRemaining,
      rateReset
    } = getRateLimits(headers);
    this.rateLimit = rateLimit;
    this.rateRemaining = rateRemaining;
    this.rateReset = rateReset;
  }

  getFillRateLimits() {
    return {
      rateLimit: this.rateLimit,
      rateRemaining: this.rateRemaining,
      rateReset: this.rateReset
    };
  }

  async request(...parameters) {
    try {
      const response = await super.request(...parameters);
      this.fillRateLimits(response.source.headers);
      return response;
    } catch (exception) {
      if (exception instanceof FitbitApiException) {
        this.fillRateLimits(exception.getResponse().source.headers);

        if (exception.getResponse().status === 429) {
          throw new FitbitApiLimitException(exception.getResponse(), exception.getRequest());
        }
      }

      throw exception;
    }
  }

  getDateString(date) {
    return date.toFormat(this.dateFormat);
  }

  getDateTimeString(date) {
    return date.toFormat(this.dateTimeFormat);
  }

  setAccessToken(token) {
    this.accessToken = token;
    this.setDefaultHeader('Authorization', `Bearer ${token}`);
  }

  getAccessToken() {
    return this.accessToken;
  }

  getLoginUrl(redirectUri, scope, {
    responseType,
    prompt,
    expiresIn,
    state
  } = {
    responseType: 'code'
  }) {
    return `https://www.fitbit.com/oauth2/authorize${restApiHandler.Api.convertParametersToUrl(_objectSpread(_objectSpread(_objectSpread({
      response_type: responseType,
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: scope.join(' ')
    }, prompt ? {
      prompt
    } : {}), state ? {
      state
    } : {}), expiresIn ? {
      expires_in: expiresIn
    } : {}))}`;
  }

  async requestToken(parameters) {
    const response = await this.request(`oauth2/token${restApiHandler.Api.convertParametersToUrl(parameters)}`, 'POST', {}, {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${base64Encode(`${this.clientId}:${this.secret}`)}`
    });
    this.setAccessToken(response.data.access_token);
    return _objectSpread(_objectSpread({}, response.data), {}, {
      expireDate: luxon.DateTime.utc().plus({
        seconds: response.data.expires_in
      }).toISO()
    });
  }

  requestAccessToken(code, redirectUri, expiresIn, state) {
    return this.requestToken(_objectSpread(_objectSpread({
      code,
      grant_type: 'authorization_code',
      client_id: this.clientId,
      redirect_uri: redirectUri
    }, expiresIn ? {
      expires_in: expiresIn
    } : {}), state ? {
      state
    } : {}));
  }

  extendAccessToken(token, expiresIn) {
    return this.requestToken(_objectSpread({
      refresh_token: token,
      grant_type: 'refresh_token'
    }, expiresIn ? {
      expires_in: expiresIn
    } : {}));
  }

  getApiUrl(namespace, userId, version = '1', file = 'json') {
    return `${version}/user/${userId || '-'}/${namespace}.${file}`;
  }

  async getProfile() {
    const {
      data
    } = await this.get(this.getApiUrl('profile'));
    return data;
  }

  async getIntradayData(resource, from, to, detail = '1min') {
    const until = to || from.endOf('day'); // eslint-disable-next-line max-len

    const response = await this.get(this.getApiUrl(`activities/${resource}/date/${from.toFormat(this.dateFormat)}/${until.toFormat(this.dateFormat)}/${detail}/time/${from.toFormat(this.timeFormat)}/${until.toFormat(this.timeFormat)}`));
    const sets = response.data[`activities-${resource}-intraday`].dataset.map(set => {
      return {
        time: luxon.DateTime.fromFormat(`${from.toFormat(this.dateFormat)}${set.time}`, `${this.dateFormat}HH:mm:ss`),
        value: set.value
      };
    });
    return {
      total: Number(response.data[`activities-${resource}`][0].value),
      sets
    };
  }

  async getActivitySummary(date, userId) {
    const url = this.getApiUrl(`activities/date/${typeof date === 'string' ? date : date.toFormat(this.dateFormat)}`, userId);
    const {
      data
    } = await this.get(url);
    return _objectSpread(_objectSpread({}, data), {}, {
      activities: data.activities.map(activity => {
        return Activity.fromApi(activity);
      })
    });
  } // eslint-disable-next-line complexity


  processDateFilters(filters) {
    const {
      afterDate,
      beforeDate,
      limit,
      offset
    } = filters;
    return _objectSpread(_objectSpread({
      sort: afterDate ? 'asc' : 'desc',
      offset: offset || 0,
      limit: limit || 10
    }, afterDate ? {
      afterDate: typeof afterDate === 'string' ? afterDate : this.getDateTimeString(afterDate)
    } : {}), beforeDate ? {
      beforeDate: typeof beforeDate === 'string' ? beforeDate : this.getDateTimeString(beforeDate)
    } : {});
  }

  async requestSleepData(url, query) {
    const {
      data
    } = await this.get(url, query);
    return _objectSpread(_objectSpread({}, data), {}, {
      sleep: data.sleep.map(sleep => {
        return {
          id: sleep.logId,
          startDateTime: luxon.DateTime.fromISO(sleep.startTime, {
            zone: 'UTC+0'
          }),
          endDateTime: luxon.DateTime.fromISO(sleep.endTime, {
            zone: 'UTC+0'
          }),
          duration: luxon.Duration.fromObject({
            milliseconds: sleep.duration
          }),
          isMainSleep: sleep.isMainSleep,
          efficiency: sleep.efficiency,
          afterWakeup: luxon.Duration.fromObject({
            minutes: sleep.minutesAfterWakeup
          }),
          asleep: luxon.Duration.fromObject({
            minutes: sleep.minutesAsleep
          }),
          awake: luxon.Duration.fromObject({
            minutes: sleep.minutesAwake
          }),
          toFallAsleep: luxon.Duration.fromObject({
            minutes: sleep.minutesToFallAsleep
          }),
          source: sleep
        };
      })
    });
  }

  async getSleep(date) {
    return this.requestSleepData(this.getApiUrl(`sleep/date/${date.toFormat(this.dateFormat)}`, undefined, '1.2'));
  }

  async getSleeps(filters) {
    return this.requestSleepData(this.getApiUrl('sleep/list', undefined, '1.2'), this.processDateFilters(filters));
  }

  async requestWeightData(url, query) {
    const {
      data
    } = await this.get(url, query);
    return {
      weights: data.weight.map(weight => {
        return _objectSpread({}, weight);
      })
    };
  }
  /**
  * Gets the weights from the period specified by from and to params.
  * Note: the period shouldn't be longer than 31 days.
  * 
  * @param from the first day of the period to query
  * @param to the last day of the period to query, defaults to Date.now()
  */


  async getWeightsBetweenDates(from, to = luxon.DateTime.fromMillis(Date.now())) {
    return this.requestWeightData(this.getApiUrl(`body/log/weight/date/${from.toFormat(this.dateFormat)}/${to.toFormat(this.dateFormat)}`, undefined, '1'));
  }

  async requestHeartRateData(url, query) {
    const {
      data
    } = await this.get(url, query);
    const activitiesHeart = data['activities-heart'];
    return {
      heartData: activitiesHeart.map(hr => {
        return {
          dateTime: hr.dateTime,
          customHeartRateZones: hr.value.customHeartRateZones,
          heartRateZones: hr.value.heartRateZones,
          restingHeartRate: hr.value.restingHeartRate
        };
      })
    };
  }

  async requestHeartRateIntradayData(url, query) {
    const {
      data
    } = await this.get(url, query);
    const activitiesHeart = data['activities-heart'];
    const activitiesHeartIntraday = data['activities-heart-intraday'];
    return {
      heartData: activitiesHeart.map(hr => {
        return {
          dateTime: hr.dateTime,
          customHeartRateZones: hr.value.customHeartRateZones,
          heartRateZones: hr.value.heartRateZones,
          restingHeartRate: hr.value.restingHeartRate
        };
      }),
      heartIntradayData: activitiesHeartIntraday.dataset.map(hri => {
        return _objectSpread({}, hri);
      })
    };
  }

  async getHeartRateBetweenDates(from, to = luxon.DateTime.fromMillis(Date.now()), detailLevel = 'min') {
    return this.requestHeartRateData(this.getApiUrl(`activities/heart/date/${from.toFormat(this.dateFormat)}/${to.toFormat(this.dateFormat)}/1${detailLevel}`, undefined, '1'));
  }

  async getHeartRateIntraday(on, detailLevel = 'min') {
    return this.requestHeartRateIntradayData(this.getApiUrl(`activities/heart/date/${on.toFormat(this.dateFormat)}/1d/1${detailLevel}`, undefined, '1'));
  }

  async getActivity(activityId) {
    const {
      data
    } = await this.get(this.getApiUrl(`activities/${activityId}`, undefined, '1.1'));
    return Activity.fromApi(data.activityLog);
  }

  async getActivityTcx(activityId) {
    const {
      data
    } = await this.get(this.getApiUrl(`activities/${activityId}`, undefined, '1.1', 'tcx'));
    return data;
  } // eslint-disable-next-line complexity


  async getActivities(filters) {
    const {
      data
    } = await this.get(this.getApiUrl('activities/list'), this.processDateFilters(filters));
    return _objectSpread(_objectSpread({}, data), {}, {
      activities: data.activities.map(activity => {
        return Activity.fromApi(activity);
      })
    });
  }

  async getActivitiesBetweenDates(from, to, limit = 10) {
    const data = await this.getActivities({
      afterDate: from,
      limit
    });
    return _objectSpread(_objectSpread({}, data), {}, {
      activities: data.activities.filter(activity => activity.getStart() <= to)
    });
  }

  async processActivities(filter, processor) {
    const {
      activities,
      pagination
    } = await this.getActivities(filter);
    const processorPromises = activities.map(workout => {
      return processor(workout);
    });

    if (pagination.next) {
      const data = queryString.parseUrl(pagination.next).query;
      processorPromises.push(...(await this.processActivities(data, processor)));
    }

    return Promise.all(processorPromises);
  }
  /**
   * https://dev.fitbit.com/build/reference/web-api/activity/#activity-logging
   *
   * @param activity
   * @returns {Promise<Activity>}
   */


  async logActivity(activity) {
    const calories = activity.getCalories();
    const distance = activity.getDistance();

    const parameters = _objectSpread(_objectSpread({
      date: activity.getStart().toFormat(this.dateFormat),
      startTime: activity.getStart().toFormat(this.timeFormat),
      durationMillis: activity.getDuration().as('milliseconds'),
      activityId: activity.getTypeId()
    }, calories != null ? {
      manualCalories: Math.round(calories)
    } : {}), distance != null ? {
      distance: distance.toNumber('km')
    } : {});

    const {
      data
    } = await this.post(this.getApiUrl('activities'), parameters, Api.FORMATS.FORM_DATA);
    return Activity.fromApi(data.activityLog);
  }

  async requestSubscription(method, collection, id, subscriberId) {
    const {
      data
    } = await this.request(this.getApiUrl(`${collection ? `${collection}/` : ''}apiSubscriptions${id ? `/${id}` : ''}`), method, {}, _objectSpread({}, subscriberId ? {
      'X-Fitbit-Subscriber-Id': subscriberId
    } : {}));
    return data;
  }
  /**
   * https://dev.fitbit.com/build/reference/web-api/subscriptions/#adding-a-subscription
   *
   * @param id
   * @param collection
   * @param subscriberId
   * @returns {Promise<SubscriptionResponse>}
   */


  async addSubscription(id, collection, subscriberId) {
    const data = await this.requestSubscription('POST', collection, id, subscriberId);
    return _objectSpread(_objectSpread({}, data), {}, {
      subscriberId: Number(data.subscriberId),
      subscriptionId: Number(data.subscriptionId)
    });
  }
  /**
   * https://dev.fitbit.com/build/reference/web-api/subscriptions/#deleting-a-subscription
   *
   * @param id
   * @param collection
   * @param subscriberId
   * @returns {Promise<Object>}
   */


  deleteSubscription(id, collection, subscriberId) {
    return this.requestSubscription('DELETE', collection, id, subscriberId);
  }
  /**
   * https://dev.fitbit.com/build/reference/web-api/subscriptions/#getting-a-list-of-subscriptions
   *
   * @param collection
   * @returns {Promise<void>}
   */


  async getSubscriptions(collection) {
    const data = await this.requestSubscription('GET', collection);
    return data.apiSubscriptions;
  }

  verifyFitbitRequest(body, signature) {
    const hmac = crypto__default['default'].createHmac('sha1', `${this.secret}&`);
    hmac.update(body);
    return encodeURI(hmac.digest().toString('base64')) === signature;
  }

}

module.exports = Api;
