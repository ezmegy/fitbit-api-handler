'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var luxon = require('luxon');
var FitbitException = require('../exceptions/FitbitException.js');
var fitnessModels = require('fitness-models');
var mathjs = require('../helpers/mathjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
class Activity extends fitnessModels.Workout {
  constructor(options) {
    super(options);

    _defineProperty__default['default'](this, "typeId", void 0);

    _defineProperty__default['default'](this, "typeName", void 0);

    _defineProperty__default['default'](this, "id", void 0);

    _defineProperty__default['default'](this, "steps", void 0);

    _defineProperty__default['default'](this, "tcxLink", void 0);

    _defineProperty__default['default'](this, "source", void 0);

    this.typeId = options.typeId;
    this.typeName = options.typeName;
    this.id = options.id;
    this.steps = options.steps;
    this.tcxLink = options.tcxLink;
    this.source = options.source;
  }

  static fromApi(activity) {
    const {
      distance
    } = activity;
    const activityId = activity.activityTypeId || activity.activityId;

    if (!activityId) {
      throw new FitbitException('ApiActivity type ID was not found in API response.');
    }

    return new Activity(_objectSpread({
      start: luxon.DateTime.fromISO(activity.startTime, {
        setZone: true
      }),
      id: activity.logId,
      duration: luxon.Duration.fromMillis(activity.duration),
      typeName: activity.activityName || activity.name,
      typeId: activityId,
      avgHeartRate: activity.averageHeartRate,
      calories: activity.calories,
      steps: activity.steps,
      tcxLink: activity.tcxLink,
      source: activity
    }, distance != null ? {
      distance: mathjs.unit(activity.distance, 'km')
    } : {}));
  } // eslint-disable-next-line max-params


  static get(typeId, start, duration, distance, calories) {
    return new Activity({
      calories,
      typeId,
      start,
      duration,
      distance,
      id: undefined,
      source: undefined
    });
  }

  clone(extension) {
    return new Activity(_objectSpread(_objectSpread({}, this.toObject()), extension));
  }

  getId() {
    return this.id;
  }

  setId(id) {
    return this.clone({
      id
    });
  }

  getTypeId() {
    return this.typeId;
  }

  getTypeName() {
    return this.typeName || 'unknown';
  }

  getSource() {
    return this.source;
  }

  getSteps() {
    return this.steps;
  }

  getTcxLink() {
    return this.tcxLink;
  }

  toString() {
    const distance = this.getDistance();
    return [`Workout ${this.getId() || ''}`, `type: ${this.getTypeName()}`, `start: ${this.getStart().toFormat('yyyy-MM-dd HH:mm')}`, distance != null ? `distance: ${Math.round(distance.toNumber('km') * 10) / 10}km` : null, `duration: ${Math.round(this.getDuration().as('minutes'))}min`].filter(item => item !== null).join('; ');
  }

  toObject() {
    return _objectSpread(_objectSpread({}, super.toObject()), {}, {
      typeId: this.typeId,
      points: this.points,
      hashtags: this.hashtags,
      id: this.id,
      source: this.source
    });
  }

}

module.exports = Activity;
