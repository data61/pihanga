"use strict";

exports.__esModule = true;
exports.sortBy = sortBy;

/**
 * Sort the given array by the given key of every item in the array
 * @param arrays
 * @param key
 * @param descendingOrder
 */
function sortBy(arrays, key, descendingOrder) {
  return arrays.sort(function (p1, p2) {
    var compareValue = p1[key].localeCompare(p2[key]);
    return descendingOrder ? -compareValue : compareValue;
  });
}