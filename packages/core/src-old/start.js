import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import isFunction from 'lodash.isfunction';

import { RouterComponentWrapper, init as routerInit } from './router';
import { Reducer, createStore } from './redux';
import { createLogger } from './logger';
import { registerCards, registerCardComponent } from './card.service';

const logger = createLogger('pihanga:start');

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
  const routerComponentWrapper = new RouterComponentWrapper({});
  const getRoute = routerComponentWrapper.getRoute.bind(routerComponentWrapper);
  routerInit(register.reducer, getRoute);
  register.routing = routerComponentWrapper.registerRouting.bind(
    routerComponentWrapper
  );
}

function initReducer(register) {
  const reducer = new Reducer({});
  register.reducer = reducer.registerReducer.bind(reducer);
  return reducer;
}

export const enrollModule = initF => {
  if (isFunction(initF)) {
    initF(register);
  } else {
    logger.warn(`Parameter to "enrollModule" - "${initF}" is not a function.`);
  }
}

function initModules(register, { inits, initDirs }) {
  // if (initDirs) {
  //   for (const dir in initDirs) {
  //     registerPackage(dir);
  //   }
  //   const moduleById = {};
  //   for (const m in moduleById) {
  //     logger.debugSilently(`Discovered module ${m}`);
  //     const module = moduleById[m];
  //     if (module.init !== undefined) {
  //       module.init(register);
  //       //   reducer.registerReducer.bind(reducer),
  //       //   routerComponentWrapper.registerRouting.bind(routerComponentWrapper),
  //       // );
  //     } else {
  //       // There can be lots of cases where there is no `init()` since the component doesn't need to
  //       // register any actions OR has any routing config.
  //       // For these cases, it is intentional, thus, printing out this message is not needed
  //       // logger.debug(`Module index "${p}" does NOT contain an init() function`);
  //     }
  //   }
  // }
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


export const start = (opts) => {
  const reducer = initReducer(register, opts);
  
  initRouting(register, opts);
  initModules(register, opts);

  if (opts.initialCards) {
    registerCards(opts.initialCards);
  }

  logger.infoSilently('Creating store');
  const store = createStore(reducer.rootReducer.bind(reducer), opts.initialReduxState);

  // // Function to initialise router component
  // // Render main component
  // const rootEl = document.getElementById(elementId);
  // routerComponentWrapper.updateRoute();
  // const mainComp = mainComponent(store, routerComponentWrapper);

  const rcf = () => {
    const rc = React.createElement(opts.rootComponent);
    return rc;
  }
  const mainComponent = React.createElement(Provider, {store: store}, rcf());
  // const mainComponent = (
  //   <Provider store={store}>
  //     { rcf() }
  //   </Provider>
  // );
  ReactDOM.render(mainComponent, opts.rootEl);
}
  
