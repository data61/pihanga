import { applyMiddleware, compose, createStore as createReduxStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from '../logger';

const logger = createLogger('store');

let store;

/**
 * Dispatch an event, then an appropriate reducer will be in charge
 * @param event
 */
export function dispatch(event) {
  // Just a defensive check here. Realistically, this can only happen at the
  // initial bootstrapping step, where each modules might call dispatch before
  // store is defined
  if (store !== undefined) {
    store.dispatch(event);
    logger.info(`Dispatched event ${event.type}`, event);
  } else {
    const scheduleEventMs = 100;
    logger.debug(
      `Schedule event ${event} to be executed in ${scheduleEventMs} ms because` +
      '\'store\' wasn\'t defined yet', event);

    // retry later
    setTimeout(() => dispatch(event), scheduleEventMs);
  }
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
export function createStore(rootReducer, initialState = {}) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk);

  /* eslint-disable no-underscore-dangle */
  // For redux-devtools-extension on browser
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  /* eslint-enable no-underscore-dangle */

  // Create final store and subscribe router in debug env ie. for devtools
  store = middleware(createReduxStore)(rootReducer, initialState);
  return store;
}
