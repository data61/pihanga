"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.arrayToDict = arrayToDict;

var _reduce = _interopRequireDefault(require("lodash/reduce"));

/**
 * Convert an array list of items to a dictionary type
 *
 * NOTE: each item must have a field called "id")
 * @param array
 * @param idFieldName
 */
function arrayToDict(array, idFieldName) {
  return (0, _reduce.default)(array, function (itemDict, item) {
    var tmp = itemDict;
    tmp[item[idFieldName]] = item;
    return tmp;
  }, {});
}