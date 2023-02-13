import { createLogger } from './logger';
import environment from 'environments/environment';
import { LOGGER_ACTION_TYPES } from '../../../n1-core/logger.actions';

jest.mock('environments/environment', () => ({
  environment: {
    debugEnabled: undefined,
  },
}));

describe('Logger', () => {
  let commonMockLogFunction = (prefix, actualMessage) => {
    return prefix + actualMessage;
  };

  console.debug = jest.fn(commonMockLogFunction);
  console.warn = jest.fn(commonMockLogFunction);
  console.info = jest.fn(commonMockLogFunction);
  console.error = jest.fn(commonMockLogFunction);

  it('should initialise logger object with all necessary log methods', () => {
    environment.debugEnabled = true;

    const moduleName = 'TEST MODULE';
    const messageToLog = 'logger works';

    const testLogger = createLogger(moduleName);

    expect(testLogger.debug(messageToLog)).toEqual(`[DEBUG: ${moduleName}]:` + messageToLog);
    expect(testLogger.warn(messageToLog)).toEqual(`[WARN: ${moduleName}]:` + messageToLog);
    expect(testLogger.info(messageToLog)).toEqual(`[INFO: ${moduleName}]:` + messageToLog);
    expect(testLogger.error(messageToLog)).toEqual(`[ERROR: ${moduleName}]:` + messageToLog);
  });

  it('should NOT print out any thing for debug and info if debug is disable (except error)',
    () => {
      environment.debugEnabled = false;

      const moduleName = 'TEST MODULE';
      const messageToLog = 'logger works';

      const testLogger = createLogger(moduleName);

      expect(testLogger.debug('')).toBeUndefined();
      expect(testLogger.info('')).toBeUndefined();

      // The only exception
      expect(testLogger.error(messageToLog)).toEqual(`[ERROR: ${moduleName}]:` + messageToLog);
  });

  it('should NOT print out any thing for log action event',
    () => {
      environment.debugEnabled = true;

      const moduleName = 'TEST MODULE';

      const testLogger = createLogger(moduleName);

      expect(testLogger.debug('', { type: LOGGER_ACTION_TYPES.EMIT_LOGGED_SOMETHING })).toBeUndefined();
      expect(testLogger.info('', { type: LOGGER_ACTION_TYPES.EMIT_LOGGED_SOMETHING })).toBeUndefined();

    });
});
