"use strict";

var _number = require("./number");

describe('Utils: Number', function () {
  describe('getIntegerNumberRandomiser()', function () {
    it('should randomise a number within the given range', function () {
      var testRandomNumber = (0, _number.getIntegerNumberRandomiser)(0, 1)();
      expect(testRandomNumber >= 0 && testRandomNumber <= 1).toBeTruthy();
    });
    it('should randomise a number within the given range even if the range is given in a wrong' + ' order', function () {
      var testRandomNumber = (0, _number.getIntegerNumberRandomiser)(1, 0)();
      expect(testRandomNumber >= 0 && testRandomNumber <= 1).toBeTruthy();
    });
    it('should deal with undefined range', function () {
      var testRandomNumber = (0, _number.getIntegerNumberRandomiser)(undefined, 0)();
      expect(testRandomNumber !== undefined).toBeTruthy();
      testRandomNumber = (0, _number.getIntegerNumberRandomiser)(undefined, undefined)();
      expect(testRandomNumber !== undefined).toBeTruthy();
      testRandomNumber = (0, _number.getIntegerNumberRandomiser)(0, undefined)();
      expect(testRandomNumber !== undefined).toBeTruthy();
    });
  });
  describe('prettifyNumber()', function () {
    it('should prettify a number correctly', function () {
      expect((0, _number.prettifyNumber)(100000)).toEqual('100,000');
      expect((0, _number.prettifyNumber)(123456789)).toEqual('123,456,789');
      expect((0, _number.prettifyNumber)(123456789.123406)).toEqual('123,456,789.1234');
      expect((0, _number.prettifyNumber)(-123456789.123456)).toEqual('-123,456,789.1235');
    });
    it('should deal with undefined number', function () {
      expect((0, _number.prettifyNumber)(undefined)).toEqual(undefined);
    });
  });
});