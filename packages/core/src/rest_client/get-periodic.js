import { dispatchFromReducer } from '../redux';
import { parseURL, buildURL, runGET } from './get';
import { ACTION_TYPES } from './rest.actions';

let registerReducer;

/**
 * Standard pihanga init function to initialize this package.
 */
export function init(register) {
  registerReducer = register.reducer;
}

export function registerPeriodicGET({
  name, url,
  intervalMS = 5000,
  // eslint-disable-next-line no-shadow
  start = '@@INIT', init,
  request, reply, error,
}) {
  if (!name) {
    throw Error('Missing "name"');
  }
  if (!url) {
    throw Error('Missing "url"');
  }
  if (!request) {
    throw Error('Missing "request"');
  }
  if (!reply) {
    throw Error('Missing "reply"');
  }

  const { parts, variables } = parseURL(url);

  const submitType = `${ACTION_TYPES.GET_SUBMITTED}:${name}`;
  const tickType = `${ACTION_TYPES.GET_PERIODIC_TICK}:${name}`;
  const resultType = `${ACTION_TYPES.GET_RESULT}:${name}`;
  const errorType = `${ACTION_TYPES.GET_ERROR}:${name}`;

  function tick() {
    dispatchFromReducer({ type: tickType, queryID: name });
  }

  registerReducer(start, (state, action) => {
    tick();
    return init ? init(state, action) : state;
  });

  registerReducer(tickType, (state) => {
    const vars = request(state, variables);
    if (vars) {
      // eslint-disable-next-line no-shadow
      const url = buildURL(parts, vars, variables);
      runGET(url, name, vars, resultType, errorType);
      // eslint-disable-next-line object-curly-newline
      dispatchFromReducer({ type: submitType, queryID: name, url, vars });
    }
    return state;
  });

  registerReducer(resultType, (state, action) => {
    setTimeout(tick, intervalMS);
    return reply(state, action.reply);
  });

  if (error) {
    // eslint-disable-next-line arrow-body-style
    registerReducer(errorType, (state, action) => {
      return reply(state, action.error);
    });
  }
}
