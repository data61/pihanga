"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.renderTime = renderTime;
exports.humaniseDuration = humaniseDuration;
exports.TIME_UNITS_TO_LABEL = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _humanizeDuration = _interopRequireDefault(require("humanize-duration"));

var TIME_FORMAT = 'Do MMM YYYY, h:mm a';
/**
 * If the time difference needs to exact, consider using {@link humaniseDuration()}
 * @param s
 * @returns {*} The time difference between the given time and now. Note this time difference can
 * be approximate, e.g if the difference is 200 ms, this will return "few seconds ago".
 */

function renderTime(s) {
  if (!s) return '';
  var now = Date.now();
  var m = (0, _moment.default)(s);
  var daysAgo = (now - m.valueOf()) / 1000 / 86400;
  return daysAgo > 7 ? m.format(TIME_FORMAT) : m.from(now);
}

var TIME_UNITS_TO_LABEL = {
  s: 'seconds',
  m: 'minutes',
  h: 'hours',
  d: 'days'
};
/**
 *
 * @param value A number value
 * @param unit One of Object.keys(TIME_UNITS_TO_LABEL)
 * @returns {*} The exact humanised string of the given value
 */

exports.TIME_UNITS_TO_LABEL = TIME_UNITS_TO_LABEL;

function humaniseDuration(value, unit) {
  // NOTE: these units can be different from moment library, hence not re-using the above units
  var units = ['d', 'h', 'm', 's'];
  return (0, _humanizeDuration.default)(_moment.default.duration(value, unit).asMilliseconds(), {
    units: units,
    conjunction: ' and '
  });
}