"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _logger = require("./logger");

var _environment = _interopRequireDefault(require("environments/environment"));

var _logger2 = require("../../../n1-core/logger.actions");

jest.mock('environments/environment', function () {
  return {
    environment: {
      debugEnabled: undefined
    }
  };
});
describe('Logger', function () {
  var commonMockLogFunction = function commonMockLogFunction(prefix, actualMessage) {
    return prefix + actualMessage;
  };

  console.debug = jest.fn(commonMockLogFunction);
  console.warn = jest.fn(commonMockLogFunction);
  console.info = jest.fn(commonMockLogFunction);
  console.error = jest.fn(commonMockLogFunction);
  it('should initialise logger object with all necessary log methods', function () {
    _environment.default.debugEnabled = true;
    var moduleName = 'TEST MODULE';
    var messageToLog = 'logger works';
    var testLogger = (0, _logger.createLogger)(moduleName);
    expect(testLogger.debug(messageToLog)).toEqual("[DEBUG: " + moduleName + "]:" + messageToLog);
    expect(testLogger.warn(messageToLog)).toEqual("[WARN: " + moduleName + "]:" + messageToLog);
    expect(testLogger.info(messageToLog)).toEqual("[INFO: " + moduleName + "]:" + messageToLog);
    expect(testLogger.error(messageToLog)).toEqual("[ERROR: " + moduleName + "]:" + messageToLog);
  });
  it('should NOT print out any thing for debug and info if debug is disable (except error)', function () {
    _environment.default.debugEnabled = false;
    var moduleName = 'TEST MODULE';
    var messageToLog = 'logger works';
    var testLogger = (0, _logger.createLogger)(moduleName);
    expect(testLogger.debug('')).toBeUndefined();
    expect(testLogger.info('')).toBeUndefined(); // The only exception

    expect(testLogger.error(messageToLog)).toEqual("[ERROR: " + moduleName + "]:" + messageToLog);
  });
  it('should NOT print out any thing for log action event', function () {
    _environment.default.debugEnabled = true;
    var moduleName = 'TEST MODULE';
    var testLogger = (0, _logger.createLogger)(moduleName);
    expect(testLogger.debug('', {
      type: _logger2.LOGGER_ACTION_TYPES.EMIT_LOGGED_SOMETHING
    })).toBeUndefined();
    expect(testLogger.info('', {
      type: _logger2.LOGGER_ACTION_TYPES.EMIT_LOGGED_SOMETHING
    })).toBeUndefined();
  });
});