import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import isFunction from 'lodash.isfunction';

import { init as routerInit, navigateToPage, browserHistory } from './router';
import { Reducer, createStore } from './redux';
import { createLogger } from './logger';
import { registerCards, registerCardComponent } from './card.service';
import { config as backendConfig } from './backend';

const logger = createLogger('pihanga:core:start');

const register = {
  cardComponent: registerCardComponent,
  cards: registerCards,
};

export const context2InitFunctions = (ctxt) => {
  const initFunctions = ctxt.keys().map((m) => {
    const c = ctxt(m);
    return c.init;
  });
  return initFunctions;
}

function initRouting(register, opts) {
  routerInit(register.reducer, opts);
}

function initReducer(register) {
  const reducer = new Reducer({});
  register.reducer = reducer.registerReducer.bind(reducer);
  return reducer;
}

function initModules(register, { inits, initDirs }) {
  if (inits) {
    for (const i in inits) {
      const f = inits[i];
      if (isFunction(f)) {
        f(register);
      } else {
        logger.warn('Init function "' + f + '" is not a function.');
      }
    }
  }
}

function initStore(reducer, opts) {
  logger.infoSilently('Creating store');
  const state = opts.initialReduxState;
  if (!state.pihanga) {
    state.pihanga = {};
  }
  if (!state.route) {
    state.route = {};
  }
  if (!state.route.path) {
    state.route.path = getPath(opts);
  }
  initPathEvent(opts);
  return createStore(reducer.rootReducer.bind(reducer), opts.initialReduxState);
}

function getPath(opts) {
  const path = opts.currentPath();
  return path;
}

function initPathEvent(opts) {
  if (opts.path) {
    navigateToPage(opts.path, true);
  }
}

export const start = (opts) => {
  const reducer = initReducer(register, opts);
  
  initRouting(register, opts);
  initModules(register, opts);

  if (opts.initialCards) {
    registerCards(opts.initialCards);
  }

  if (opts.environment) {
    backendConfig(opts.environment);
  }

  const store = initStore(reducer, opts);

  const rcf = () => {
    const rc = React.createElement(opts.rootComponent);
    return rc;
  }
  const mainComponent = React.createElement(Provider, {store: store}, rcf());
  ReactDOM.render(mainComponent, opts.rootEl);
}
  
