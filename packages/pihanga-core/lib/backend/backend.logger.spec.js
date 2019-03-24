"use strict";

var _backend = require("./backend.logger");

var _n1Core = require("n1-core");

jest.mock('core', function () {
  return {
    createLogger: jest.fn(function () {
      return {};
    })
  };
});
describe('BackendLogger', function () {
  it('should initialise a logger correctly', function () {
    expect(_n1Core.createLogger).toHaveBeenCalled();
    expect(_backend.backendLogger).not.toBeUndefined();
  });
});