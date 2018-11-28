/* eslint-disable no-console */
const LOG_LEVEL = {
  DEBUG: 4,
  INFO: 3,
  WARN: 2,
  ERROR: 1,
  OFF: 0,
};

/**
 * LoggerFactory
 *
 * NOTE: Create logger wisely to avoid unnecessary log messages on user console. Any errors or
 * warnings should be presented to user rather than using logger.
 */
export class LoggerFactory {
  static level = 'DEBUG';

  static setLevel(newLevel) {
    if (newLevel && LOG_LEVEL[newLevel.toUpperCase()]) {
      LoggerFactory.level = newLevel.toUpperCase();
    }
  }

  /**
   * Create a new logger
   * @param module Used to provide extra information for the log messages
   * @returns {debug, info, warn, error}
   * @constructor
   */
  static create(module) {
    const logger = {
      debug: (console.debug && console.debug.bind(console, `[DEBUG: ${module}]:`)) || (() => {}),
      info: (console.info && console.info.bind(console, `[INFO: ${module}]:`)) || (() => {}),
      warn: (console.warn && console.warn.bind(console, `[WARN: ${module}]:`)) || (() => {}),
      error: (console.error && console.error.bind(console, `[ERROR: ${module}]:`)) || (() => {}),
    };

    return new Proxy(logger, {
      get(target, propKey) {
        const originalMethod = target[propKey];
        return (...args) => {
          if (LOG_LEVEL[LoggerFactory.level] >= LOG_LEVEL[propKey.toUpperCase()]) {
            return originalMethod.apply(this, args);
          }

          return undefined;
        };
      },
    });
  }
}
