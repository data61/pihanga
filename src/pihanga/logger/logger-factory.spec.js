import { LoggerFactory } from './logger-factory';

describe('Logger', () => {
  let commonMockLogFunction = (prefix, actualMessage) => {
    return prefix + actualMessage;
  };

  console.debug = jest.fn(commonMockLogFunction);
  console.warn = jest.fn(commonMockLogFunction);
  console.info = jest.fn(commonMockLogFunction);
  console.error = jest.fn(commonMockLogFunction);

  it('should initialise logger object with all necessary log methods', () => {
    LoggerFactory.setLevel('debug');

    const moduleName = 'TEST MODULE';
    const messageToLog = 'logger works';

    const testLogger = LoggerFactory.create(moduleName);

    expect(testLogger.debug(messageToLog)).toEqual(`[DEBUG: ${moduleName}]:` + messageToLog);
    expect(testLogger.warn(messageToLog)).toEqual(`[WARN: ${moduleName}]:` + messageToLog);
    expect(testLogger.info(messageToLog)).toEqual(`[INFO: ${moduleName}]:` + messageToLog);
    expect(testLogger.error(messageToLog)).toEqual(`[ERROR: ${moduleName}]:` + messageToLog);
  });

  it('should NOT print out any thing for debug and info if debug is disable (except error)', () => {
    LoggerFactory.setLevel('error');

    const moduleName = 'TEST MODULE';
    const messageToLog = 'logger works';

    const testLogger = LoggerFactory.create(moduleName);

    expect(testLogger.debug('')).toBeUndefined();
    expect(testLogger.info('')).toBeUndefined();

    // The only exception
    expect(testLogger.error(messageToLog)).toEqual(`[ERROR: ${moduleName}]:` + messageToLog);
  });
});
