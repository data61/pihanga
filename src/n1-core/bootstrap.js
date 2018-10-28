import ReactDOM from 'react-dom';
import { RouterComponentWrapper } from './router';
import { Reducer, createStore } from './redux';
import { createLogger } from './logger';
import { init as routerInit } from './router';
import { registerCards, registerCardComponent } from './card.service';
import appStructure from './app/app.pihanga';

const logger = createLogger('bootstrap');

/**
 *  Bootstrap the app on given DOM's element Id
 * @param elementId
 * @param mainComponent
 * @param initialState
 * @param moduleById
 */
export function bootstrap(elementId, mainComponent, initialState, moduleById, baseCards) {
  const routerComponentWrapper = new RouterComponentWrapper({});
  const reducer = new Reducer({});
  const registerReducer = reducer.registerReducer.bind(reducer);
  const registerRouting = routerComponentWrapper.registerRouting.bind(routerComponentWrapper);
  const getRoute = routerComponentWrapper.getRoute.bind(routerComponentWrapper);

  routerInit(registerReducer, getRoute);
  

  const register = {
    routing: registerRouting,
    reducer: registerReducer,
    cardComponent: registerCardComponent,
    cards: registerCards,
  }
  for (const m in moduleById) {
    logger.debugSilently(`Discovered module ${m}`);
    const module = moduleById[m];
    if (module.init !== undefined) {
      module.init(register);
      //   reducer.registerReducer.bind(reducer),
      //   routerComponentWrapper.registerRouting.bind(routerComponentWrapper),
      // );
    } else {
      // There can be lots of cases where there is no `init()` since the component doesn't need to
      // register any actions OR has any routing config.
      // For these cases, it is intentional, thus, printing out this message is not needed
      // logger.debug(`Module index "${p}" does NOT contain an init() function`);
    }
  }
  registerCards(appStructure); // base structure, some cards may also have been registered in inits

  logger.infoSilently('Creating store');
  const store = createStore(reducer.rootReducer.bind(reducer), initialState);

  // Function to initialise router component
  // Render main component
  const rootEl = document.getElementById(elementId);
  routerComponentWrapper.updateRoute();
  const mainComp = mainComponent(store, routerComponentWrapper);
  ReactDOM.render(mainComp, rootEl);
}
