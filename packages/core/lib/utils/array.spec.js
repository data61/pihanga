"use strict";

var _array = require("./array");

function isArraySorted(a, key, descendingOrder) {
  if (a.length <= 1) {
    return;
  }

  for (var i = 1; i < a.length; i++) {
    var compareValue = a[i][key].localeCompare(a[i - 1][key]);

    if (!descendingOrder && compareValue < 0) {
      fail(a[i] + " should be placed before " + a[i - 1]);
    } else if (descendingOrder && compareValue > 0) {
      fail(a[i] + " should be placed after " + a[i - 1]);
    }
  }
}

describe('array', function () {
  var _gen$object;

  var mockItemKey = 'key';
  check.it('should sort the list of data correctly', {
    times: 50
  }, gen.array(gen.object((_gen$object = {}, _gen$object[mockItemKey] = gen.char, _gen$object))), function (x) {
    isArraySorted((0, _array.sortBy)(x, mockItemKey), mockItemKey);
    isArraySorted((0, _array.sortBy)(x, mockItemKey, true), mockItemKey, true);
  });
});