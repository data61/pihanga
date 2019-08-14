"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.dispatch = dispatch;
exports.dispatchFromReducer = dispatchFromReducer;
exports.doActionInReducer = doActionInReducer;
exports.createStore = createStore;
exports.getState = getState;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _logger = require("../logger/logger");

var logger = (0, _logger.createLogger)('store');
var DEF_STATE = {
  activity: {
    primary: 'login'
  },
  user: {}
};
var store;
/**
 * Dispatch an event, then an appropriate reducer will be in charge
 * @param event
 */

function dispatch(event) {
  // Just a defensive check here. Realistically, this can only happen at the
  // initial bootstrapping step, where each modules might call dispatch before
  // store is defined
  if (store !== undefined) {
    store.dispatch(event);
    logger.info("Dispatched event " + event.type, event);
  } else {
    var scheduleEventMs = 100;
    logger.debug("Schedule event " + event + " to be executed in " + scheduleEventMs + " ms because" + '\'store\' wasn\'t defined yet', event); // retry later

    setTimeout(function () {
      return dispatch(event);
    }, scheduleEventMs);
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


function dispatchFromReducer(event) {
  setTimeout(function () {
    return dispatch(event);
  });
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


function doActionInReducer(actionFn, actionFnArgs) {
  return function (state) {
    setTimeout(function () {
      if (actionFnArgs) {
        actionFn.apply(void 0, actionFnArgs);
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


function createStore(rootReducer, initialState) {
  if (initialState === void 0) {
    initialState = DEF_STATE;
  }

  // Compose final middleware and use devtools in debug environment
  var middleware = (0, _redux.applyMiddleware)(_reduxThunk.default);
  /* eslint-disable no-underscore-dangle */
  // For redux-devtools-extension on browser

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware = (0, _redux.compose)(middleware, window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  /* eslint-enable no-underscore-dangle */
  // Create final store and subscribe router in debug env ie. for devtools


  store = middleware(_redux.createStore)(rootReducer, initialState);
  return store;
}

function getState() {
  return store.getState();
}