import { dispatch, dispatchFromReducer } from '../redux';
import { fetchApi } from './fetch-api';
import { ACTION_TYPES } from './rest.actions';

let registerReducer;

/**
 * Standard pihanga init function to initialize this package.
 */
export function init(register) {
  registerReducer = register.reducer;
}

export function registerGET({
  name, url,
  trigger,
  request, reply, error,
}) {
  if (!name) {
    throw Error('Missing "name"');
  }
  if (!url) {
    throw Error('Missing "url"');
  }
  if (!trigger) {
    throw Error('Missing "trigger"');
  }
  if (!request) {
    throw Error('Missing "request"');
  }
  if (!reply) {
    throw Error('Missing "reply"');
  }

  const { parts, variables } = parseURL(url);

  const submitType = `${ACTION_TYPES.GET_SUBMITTED}:${name}`;
  const resultType = `${ACTION_TYPES.GET_RESULT}:${name}`;
  const errorType = `${ACTION_TYPES.GET_ERROR}:${name}`;

  registerReducer(trigger, (state, action) => {
    const vars = request(action, state, variables);
    if (vars) {
      const url2 = buildURL(parts, vars, variables);
      runGET(url2, name, vars, resultType, errorType);
      // eslint-disable-next-line object-curly-newline
      dispatchFromReducer({ type: submitType, queryID: name, url: url2, vars });
    }
    return state;
  });

  registerReducer(resultType, (state, action) => {
    return reply(state, action.reply);
  });

  if (error) {
    registerReducer(errorType, (state, action) => {
      return reply(state, action.error);
    });
  }
}

const pat = /([^:]*)(:[a-z][a-z0-9_]*)(.*)/i;

export function parseURL(url) {
  let r;
  let s = url;
  const parts = [];
  const variables = [];
  // eslint-disable-next-line no-cond-assign
  while ((r = pat.exec(s)) !== null) {
    parts.push(r[1]);
    variables.push(r[2].slice(1));
    // eslint-disable-next-line prefer-destructuring
    s = r[3];
  }
  parts.push(s);
  return { url, parts, variables };
}

export function buildURL(parts, vars, variables) {
  const url = parts.reduce((u, p, i) => {
    if (i >= variables.length) {
      // usually last part
      return `${u}${p}`;
    }
    const vn = variables[i];
    const vv = vars[vn];
    if (!vv) {
      // dispatch error
    }
    return `${u}${p}${vv}`;
  }, '');
  return url;
}

export function runGET(url, name, vars, resultType, errorType) {
  fetchApi(url, {
    method: 'GET',
  }).then((reply) => {
    const p = {
      type: resultType,
      queryID: name,
      reply,
      vars,
    };
    dispatch(p);
  }).catch((error) => {
    const p = {
      type: errorType,
      queryID: name,
      error: {
        error,
        url,
        vars,
      },
    };
    dispatch(p);
  });
}
