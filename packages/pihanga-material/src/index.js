import { context2InitFunctions } from '@pihanga/core';

export function getInitFunctions() {
  const ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);
  // const p = CONTEXT_INDEX_PATTERN;
  // const c2 = require.context('.', true, CONTEXT_INDEX_PATTERN);

  // const name2f= {};
  // c.keys().forEach((m) => {
  //   const f = c(m);
  //   name2f[m] = f;
  // });
  // //return name2f;

  // const ifs = c.keys().map((m) => {
  //   const f = c(m);
  //   return f;
  // });

  const initFunctions = context2InitFunctions(ctxt);
  return initFunctions;
}
