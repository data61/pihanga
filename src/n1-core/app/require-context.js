// Place this in a separate file in order to mock this call when testing

 /**
  NOTE: require.context() can only support string literals
  (see https://github.com/webpack/webpack/issues/4772)

  This will load all modules' index.js not including the one in the top level
  directory, (hence "{2,}" regex).

  It also needs to be executed here, as 'require' is not visible within
  a function (may be a side-effect of the polyfill build process)
**/
// Can't use the following constant inside 'require.context' as it seemed to be treated
// somewhat differently.
//const SEARCH_PATTERN=/\.(\/[^/]*){2,}index\.js$/;
const CONTEXT = {
  'n1-core/app' : require.context('.', true, /\.(\/[^/]*){2,}index\.js$/),
  'n1-core/ui' : require.context('n1-core/ui', true, /\.(\/[^/]*){2,}index\.js$/),
  'n1-core/card' : require.context('n1-core/card', true, /\.(\/[^/]*){2,}index\.js$/),
  '../../plugin' : require.context('../../plugin', true, /\.(\/[^/]*){2,}index\.js$/),
};

export const requireContext = () => {

  const name2f= {};
  for (const n in CONTEXT) {
    const c = CONTEXT[n];
    c.keys().forEach((m) => {
      const f = c(m);
      name2f[n + m] = f;
    });
  }
  return name2f;
};
