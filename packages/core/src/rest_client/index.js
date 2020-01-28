import { init as getInit } from './get';
import { init as getPeriodicInit } from './get-periodic';
import { init as postPutInit } from './postPut';

export { registerGET, runGET } from './get';
export { registerPeriodicGET } from './get-periodic';
export { registerPOST, registerPUT, runPOST, runPUT } from './postPut';

/**
 * Standard pihanga init function to initialize this package.
 */
export function init(register) {
  getInit(register);
  getPeriodicInit(register);
  postPutInit(register);
}