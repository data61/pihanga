"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

var _time = require("./time");

describe('Time', function () {
  describe('renderTime()', function () {
    it('should return the approximate time difference', function () {
      expect((0, _time.renderTime)(undefined)).toEqual('');
      expect((0, _time.renderTime)((0, _moment.default)())).toEqual('a few seconds ago');
      var tempDate = new Date();
      tempDate.setDate(tempDate.getDate() - 1);
      expect((0, _time.renderTime)((0, _moment.default)(tempDate))).toEqual('a day ago');
    });
  });
  describe('humaniseDuration()', function () {
    it('should return the exact time difference', function () {
      expect((0, _time.humaniseDuration)(1, 'm')).toEqual('1 minute');
      expect((0, _time.humaniseDuration)(59, 'm')).toEqual('59 minutes');
      expect((0, _time.humaniseDuration)(62, 'm')).toEqual('1 hour and 2 minutes');
      expect((0, _time.humaniseDuration)(500, 'ms')).toEqual('0.5 seconds');
    });
  });
});