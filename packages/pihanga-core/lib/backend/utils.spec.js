"use strict";

var _utils = require("./utils");

describe('arrayToDict()', function () {
  it('should convert list of items to a dictionary correctly', function () {
    var testArray = [{
      id: 1,
      value: 11
    }, {
      id: 2,
      value: 22
    }];
    expect((0, _utils.arrayToDict)(testArray, 'id')).toEqual({
      '1': {
        id: 1,
        value: 11
      },
      '2': {
        id: 2,
        value: 22
      }
    });
  });
});