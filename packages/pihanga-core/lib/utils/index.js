"use strict";

exports.__esModule = true;
var _exportNames = {
  exportModule: true
};
exports.exportModule = exportModule;

var _array = require("./array");

Object.keys(_array).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _array[key];
});

var _percentageFormat = require("./percentage-format");

Object.keys(_percentageFormat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _percentageFormat[key];
});

var _time = require("./time");

Object.keys(_time).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _time[key];
});

var _indeterminableData = require("./indeterminable-data");

Object.keys(_indeterminableData).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _indeterminableData[key];
});

var _number = require("./number");

Object.keys(_number).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _number[key];
});

var _piPropTypes = require("./pi-prop-types");

Object.keys(_piPropTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _piPropTypes[key];
});

function exportModule(hash, m) {
  if (hash) {
    var _arr = Object.keys(m);

    for (var _i = 0; _i < _arr.length; _i++) {
      var k = _arr[_i];
      hash[k] = m[k];
    }
  }

  return hash;
}