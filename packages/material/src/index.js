//import isFunction from 'lodash.isfunction';

import { context2InitFunctions } from '@pihanga/core';
import { init as rootInit } from './root';

export * from './root';

export function findInitFunctions() {
  const ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);
  return ctxt;
}

export function getInitFunctions() {
  const initFunctions = context2InitFunctions(findInitFunctions());
  return initFunctions;
}

export function init(register) {
  rootInit(register);
  const ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);
  ctxt.keys().forEach(m => {
    const c = ctxt(m);
    if (c.init) {
      c.init(register)
    }
  });
}
