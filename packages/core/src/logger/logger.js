/* eslint-disable no-console */
//import environment from 'environments/environment';

// Should be configurable
const environment = {
  debugEnabled: true
};

// import { doActionInReducer } from '../redux';
// import { emitLoggedSomething, LOGGER_ACTION_TYPES } from '../../../n1-core/logger.actions';

/**
 * Logger creator
 * @param module Used to limit log level for certain modules
 * @returns {debug, info, warn, error}
 * @constructor
 */
export function createLogger(module) {
  const debugMsgPrefix = `[DEBUG: ${module}]:`;
  const infoMsgPrefix = `[INFO: ${module}]:`;
  const warningMsgPrefix = `[WARN: ${module}]:`;
  const errorMsgPrefix = `[ERROR: ${module}]:`;

  const logger = {
    /**
     * Only available when debug mode is on
     */
    debug: (() => {
      if (environment.debugEnabled && console.debug) {
        return console.debug.bind(console, debugMsgPrefix);
      }

      return () => {};
    })(),

    info: (() => {
      if (environment.debugEnabled && console.info) {
        return console.info.bind(console, infoMsgPrefix);
      }

      return () => {};
    })(),

    /**
     * Always available
     */
    warn: (() => {
      if (console.warn) {
        return console.warn.bind(console, warningMsgPrefix);
      }

      return () => {};
    })(),


    error: (() => {
      if (console.error) {
        return console.error.bind(console, errorMsgPrefix);
      }

      return () => {};
    })(),
  };

  // silent log calls won't emit any events, which can trigger a logging on the server side
  logger.debugSilently = logger.debug;
  logger.infoSilently = logger.info;
  logger.warnSilently = logger.warn;
  logger.errorSilently = logger.error;

  return new Proxy(logger, {
    get(target, propKey) {
      const originalMethod = target[propKey];
      return (...args) => {
        //const logObject = args[args.length - 1];
        // TODO: Reinstate logging events
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

        return originalMethod.apply(this, args);
      };
    },
  });
}
