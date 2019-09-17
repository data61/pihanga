// export * from './backend.logger';
// export * from './fetch-api';
// export * from './backend.actions';
// export * from './browser-cookie';
// export * from './utils';
import { init as getInit } from './get';
import { init as getPeriodicInit } from './get-periodic';


export { registerGET } from './get';
export { registerPeriodicGET } from './get-periodic';

/**
 * Standard pihanga init function to initialize this package.
 */
export function init(register) {
  getInit(register);
  getPeriodicInit(register);
}