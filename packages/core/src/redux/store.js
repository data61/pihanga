import { applyMiddleware, compose, createStore as createReduxStore } from 'redux';
import thunk from 'redux-thunk';

import { actions } from './actions';
import { createLogger } from '../logger/logger';
import { update } from './update';

const logger = createLogger('@pihanga:core:store');

const DEF_STATE = {
  activity: {
    primary: 'login',
  },
  user: {},
};

let store;

/**
 * Dispatch an event, then an appropriate reducer will be in charge
 * @param event
 */
export function dispatch(...args) {
  const event = createEvent(...args);
  _dispatch(event);
}

function createEvent(...args) {
  let e;
  switch (args.length) {
    case 1: [e] = args; break;
    case 2: e = { ...args[1], type: args[0] }; break;
    case 3: {
      const [domainName, typeName, props] = args;
      const domain = actions(domainName);
      if (!domain) {
        throw Error(`Unknown type domain '${domainName}'`);
      }
      const type = domain[typeName];
      if (!type) {
        throw Error(`Unknown type name '${typeName}' in domain '${domainName}'`);
      }
      e = { ...props, type };
      break;
    }
    default:
      throw Error('Illegal number of arguments for "disptach"');
  }
  return e;
}

function _dispatch(event) {
  // Just a defensive check here. Realistically, this can only happen at the
  // initial bootstrapping step, where each modules might call dispatch before
  // store is defined
  if (store !== undefined) {
    store.dispatch(event);
    logger.info(`Dispatched event ${event.type}`, event);
  } else {
    const scheduleEventMs = 100;
    logger.debug(
      `Schedule event ${event} to be executed in ${scheduleEventMs} ms because`
      + '\'store\' wasn\'t defined yet', event,
    );

    // retry later
    setTimeout(() => _dispatch(event), scheduleEventMs);
  }
}

/**
 * Dispatch an event from inside a reducer, then an appropriate reducer will be in charge
 *
 * It is anti-pattern to dispatch an action in a reducer. But here, we are performing a scheduled
 * action, which is not anti-pattern.
 *
 * @param event
 */
export function dispatchFromReducer(...args) {
  const event = createEvent(...args);
  setTimeout(() => _dispatch(event));
}

/**
 * Used for creating a reducer that dispatch another action.
 *
 * It is anti-pattern to dispatch an action in a reducer. But here, we are performing a scheduled
 * action, which is not anti-pattern.
 * @param actionFn
 * @param actionFnArgs (Optional)
 * @returns {function(*)}
 */
export function doActionInReducer(actionFn, actionFnArgs) {
  return (state) => {
    setTimeout(() => {
      if (actionFnArgs) {
        actionFn(...actionFnArgs);
      } else {
        actionFn();
      }
    });
    return state;
  };
}

/**
 * Create and return a new store.
 * @param rootReducer
 * @param initialState
 * @returns {*}
 */
export function createStore(rootReducer, initialState = DEF_STATE) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk);

  // For redux-devtools-extension on browser
  // eslint-disable-next-line no-undef
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    const extOpts = { trace: true, traceLimit: 25 };
    // eslint-disable-next-line no-undef
    middleware = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__(extOpts));
  }
  /* eslint-enable no-underscore-dangle */

  // Create final store and subscribe router in debug env ie. for devtools
  store = middleware(createReduxStore)(rootReducer, initialState);
  dispatch('REDUX', 'INIT', {});
  return store;
}

export function getState() {
  return store.getState() || {};
}

export function getPihangaState(name, state) {
  return ((state || getState()).pihanga || {})[name] || {};
}

export function updatePihangaState(source, name, path, leaf) {
  return update(source, ['pihanga', name].concat(path), leaf);
}
