"use strict";

exports.__esModule = true;
exports.createLogger = createLogger;

/* eslint-disable no-console */
//import environment from 'environments/environment';
// Should be configurable
var environment = {
  debugEnabled: true
}; // import { doActionInReducer } from '../redux';
// import { emitLoggedSomething, LOGGER_ACTION_TYPES } from '../../../n1-core/logger.actions';

/**
 * Logger creator
 * @param module Used to limit log level for certain modules
 * @returns {debug, info, warn, error}
 * @constructor
 */

function createLogger(module) {
  var debugMsgPrefix = "[DEBUG: " + module + "]:";
  var infoMsgPrefix = "[INFO: " + module + "]:";
  var warningMsgPrefix = "[WARN: " + module + "]:";
  var errorMsgPrefix = "[ERROR: " + module + "]:";
  var logger = {
    /**
     * Only available when debug mode is on
     */
    debug: function () {
      if (environment.debugEnabled && console.debug) {
        return console.debug.bind(console, debugMsgPrefix);
      }

      return function () {};
    }(),
    info: function () {
      if (environment.debugEnabled && console.info) {
        return console.info.bind(console, infoMsgPrefix);
      }

      return function () {};
    }(),

    /**
     * Always available
     */
    warn: function () {
      if (console.warn) {
        return console.warn.bind(console, warningMsgPrefix);
      }

      return function () {};
    }(),
    error: function () {
      if (console.error) {
        return console.error.bind(console, errorMsgPrefix);
      }

      return function () {};
    }()
  }; // silent log calls won't emit any events, which can trigger a logging on the server side

  logger.debugSilently = logger.debug;
  logger.infoSilently = logger.info;
  logger.warnSilently = logger.warn;
  logger.errorSilently = logger.error;
  return new Proxy(logger, {
    get: function get(target, propKey) {
      var _this = this;

      var originalMethod = target[propKey];
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var logObject = args[args.length - 1]; // TODO: Reinstate logging events
        // if (logObject && logObject.type === LOGGER_ACTION_TYPES.EMIT_LOGGED_SOMETHING) {
        //   // Don't dispatch any action here to avoid an infinite loop of logging
        //   // because there can be a log call inside dispatching an action
        //   // Exits since this action type is not too useful to log, it can
        //   // make the log history messy
        //   return undefined;
        // }
        // if (!propKey.endsWith('Silently')) {
        //   // Need to schedule this action because this log method can be executed inside a reducer
        //   doActionInReducer(emitLoggedSomething, [propKey, ...args])();
        // }

        return originalMethod.apply(_this, args);
      };
    }
  });
}