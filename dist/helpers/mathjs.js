'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var create = require('mathjs/lib/core/create');
var dependenciesUnitClass_generated = require('mathjs/lib/entry/dependenciesAny/dependenciesUnitClass.generated');

/* eslint-disable @typescript-eslint/ban-ts-comment,filenames/match-exported */
const mathjs = create.create({
  UnitDependencies: dependenciesUnitClass_generated.UnitDependencies
});
function unit(...params) {
  return new mathjs.Unit(...params);
}

exports.default = mathjs;
exports.unit = unit;
