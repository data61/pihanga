"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getIntegerNumberRandomiser = getIntegerNumberRandomiser;
exports.prettifyNumber = prettifyNumber;

var _numeral = _interopRequireDefault(require("numeral"));

/**
 * Get an Integer randomiser for a given range
 * @param min
 * @param max
 * @returns {function()}
 */
function getIntegerNumberRandomiser(min, max) {
  var rangeMin = min;
  var rangeMax = max;

  if (rangeMin === undefined) {
    rangeMin = Number.MIN_VALUE;
  }

  if (rangeMax === undefined) {
    rangeMax = Number.MAX_VALUE;
  } // in case a wrong order is given


  if (rangeMax < rangeMin) {
    var tmp = rangeMin;
    rangeMin = rangeMax;
    rangeMax = tmp;
  }

  return function () {
    return Math.floor(Math.random() * (1 + (rangeMax - rangeMin))) + rangeMin;
  };
}
/**
 * Prettify a number
 *
 * Examples:
 *  prettifyNumber(100000);           // '100,000'
 *  prettifyNumber(123456789);        // '123,456,789'
 *  prettifyNumber(123456789.1234);   // '123,456,789.12'
 *  prettifyNumber(-123456789.1234);  // '-123,456,789.12'
 *
 * @param number
 */


function prettifyNumber(number) {
  if (number === undefined) return undefined;
  var COMMON_NUMBER_FORMAT = '0,0.[0000]';
  return (0, _numeral.default)(number).format(COMMON_NUMBER_FORMAT);
}