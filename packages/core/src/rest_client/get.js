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
  trigger, guard,
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
    if (guard) {
      if (!guard(action, state)) {
        return state;
      }
    }
    const vars = request(action, state, variables);
    if (vars) {
      const url2 = buildURL(parts, vars, variables);
      runGET(url2, name, vars, resultType, errorType, action);
      // eslint-disable-next-line object-curly-newline
      dispatchFromReducer({ type: submitType, queryID: name, url: url2, vars });
    }
    return state;
  });

  registerReducer(resultType, (state, action) => {
    return reply(state, action.reply, action.requestAction);
  });

  if (error) {
    registerReducer(errorType, (state, action) => {
      return error(state, action.error, action.requestAction);
    });
  }
}

export function parseURL(url) {
  const variables = [];

  function isPlaceHolder(el, i, v2id) {
    if (el.startsWith(':')) {
      const vn = el.slice(1);
      variables.push(vn);
      // eslint-disable-next-line no-param-reassign
      v2id[vn] = (v2id[vn] || []).concat(i);
    }
  }

  const uq = url.split('?');
  if (uq.length > 2) {
    throw new Error(`URL '${url}' has multiple '?'.`);
  }
  const ua = uq[0].split('/');
  const v2uid = {};
  ua.forEach((el, i) => {
    isPlaceHolder(el, i, v2uid);
  });

  const qa = uq[1] ? uq[1].split('&').flatMap((el) => el.split('=')) : [];
  const v2qid = {};
  qa.forEach((el, i) => {
    isPlaceHolder(el, i, v2qid);
  });

  return { url, parts: [ua, v2uid, qa, v2qid], variables };
}

export function buildURL(parts, vars) {
  const [ua, v2uid, qa, v2qid] = parts;


  function mapA(a, v2id) {
    const a2 = [...a];
    Object.entries(v2id).forEach(([k, id]) => {
      const v = vars[k];
      if (!v) {
        throw Error(`Missing assignment to url parameter '${k}'`);
      }
      id.forEach((i) => { a2[i] = encodeURIComponent(v); });
    });
    return a2;
  }

  const ua2 = mapA(ua, v2uid);
  const path = ua2.join('/');

  const qa2 = mapA(qa, v2qid);
  const qph = vars['?'] ? { ...vars['?'] } : {};
  for (let i = 0; i < qa2.length; i += 2) {
    qph[qa2[i]] = qa2[i + 1];
  }
  const qe = Object.entries(qph);
  if (qe.length > 0) {
    const query = qe.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    return `${path}?${query}`;
  } else {
    return path;
  }
}

export function runGET(url, name, vars, resultType, errorType, requestAction) {
  fetchApi(url, {
    method: 'GET',
  }).then(([reply, contentType]) => {
    const p = {
      type: resultType,
      queryID: name,
      contentType,
      reply,
      vars,
      requestAction,
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
      requestAction,
    };
    dispatch(p);
  });
}
