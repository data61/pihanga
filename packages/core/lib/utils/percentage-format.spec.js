"use strict";

var _percentageFormat = require("./percentage-format");

describe('Utils: Percentage format', function () {
  describe('prettifyPercentage()', function () {
    it('should prettify a percentage value correctly', function () {
      expect((0, _percentageFormat.prettifyPercentage)(0.55)).toEqual('55%');
      expect((0, _percentageFormat.prettifyPercentage)(1)).toEqual('100%');
      expect((0, _percentageFormat.prettifyPercentage)(0)).toEqual('0%');
      expect((0, _percentageFormat.prettifyPercentage)(-0.5)).toEqual('-50%');
    });
  });
});