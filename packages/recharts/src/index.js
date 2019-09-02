import { context2InitFunctions } from '@pihanga/core';

export function findInitFunctions() {
  const ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);
  return ctxt;
}

export function getInitFunctions() {
  const initFunctions = context2InitFunctions(findInitFunctions());
  return initFunctions;
}

export function init(register) {
  const ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);
  ctxt.keys().forEach(m => {
    const c = ctxt(m);
    if (c.init) {
      c.init(register)
    }
  });
}
