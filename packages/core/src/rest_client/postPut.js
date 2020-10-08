import { dispatch, dispatchFromReducer } from '../redux';
import { fetchApi } from './fetch-api';
import { ACTION_TYPES } from './rest.actions';
import { parseURL, buildURL } from './get';

let registerReducer;

/**
 * Standard pihanga init function to initialize this package.
 */
export function init(register) {
  registerReducer = register.reducer;
}

export const registerPUT = (opts) => {
  registerMethod('PUT', opts);
};

export const registerPOST = (opts) => {
  registerMethod('POST', opts);
};

const registerMethod = (method, opts) => {
  const {
    name,
    url,
    trigger, guard,
    request, reply, error,
  } = opts;

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

  const submitType = `${ACTION_TYPES[`${method}_SUBMITTED`]}:${name}`;
  const resultType = `${ACTION_TYPES[`${method}_RESULT`]}:${name}`;
  const errorType = `${ACTION_TYPES[`${method}_ERROR`]}:${name}`;
  const intErrorType = `${ACTION_TYPES[`${method}_INTERNAL_ERROR`]}:${name}`;

  registerReducer(trigger, (state, action) => {
    if (guard) {
      if (!guard(action, state)) {
        return state;
      }
    }
    let r;
    try {
      r = request(action, state, variables);
    } catch (e) {
      dispatchFromReducer({
        type: intErrorType,
        call: 'request',
        // eslint-disable-next-line object-property-newline
        action, state, variables,
        error: e,
      });
    }
    const [body, vars] = r;
    if (body) {
      const url2 = buildURL(parts, vars, variables);
      try {
        runMethod(method, url2, name, body, vars, resultType, errorType, action);
      } catch (e) {
        dispatchFromReducer({
          type: intErrorType,
          call: 'runMethod',
          // eslint-disable-next-line object-property-newline
          method, url2, name, body, vars, resultType, errorType, action,
          error: e,
        });
      }
      // eslint-disable-next-line object-curly-newline
      dispatchFromReducer({
        type: submitType,
        restName: name,
        url: url2,
        body,
        vars,
      });
    }
    return state;
  });

  registerReducer(resultType, (state, action) => reply(state, action.reply, action.requestAction));

  if (error) {
    registerReducer(errorType, (state, action) => error(state, action.error, action.requestAction));
  }
};

export const runPOST = (
  url,
  name,
  body,
  vars,
  resultType, errorType,
  requestAction,
) => {
  runMethod('POST', url, name, body, vars, resultType, errorType, requestAction);
};

export const runPUT = (
  url,
  name,
  body,
  vars,
  resultType, errorType,
  requestAction,
) => {
  runMethod('PUT', url, name, body, vars, resultType, errorType, requestAction);
};

export const runMethod = (
  method,
  url,
  name,
  body,
  vars,
  resultType, errorType,
  requestAction,
) => {
  fetchApi(url, {
    method,
    body,
  }).then(([reply, contentType]) => {
    const p = {
      type: resultType,
      restName: name,
      contentType,
      reply,
      vars,
      requestAction,
    };
    dispatch(p);
  }).catch((error) => {
    const p = {
      type: errorType,
      restName: name,
      error: {
        error: error.toString(),
        stack: error.stack,
        url,
        vars,
      },
      requestAction,
    };
    dispatch(p);
  });
};
