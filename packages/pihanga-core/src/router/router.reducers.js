import { update, dispatchFromReducer } from '../redux';
import { createLogger } from '../logger';

import {  ACTION_TYPES as ROUTER_ACTION_TYPES, navigateToPage } from './router.actions';
import { browserHistory } from '.';

const logger = createLogger('pihanga:router:reducer');

const environment = {
  PATH_PREFIX: null
};

const pathPrefix = (environment.PATH_PREFIX || '');
const pathPrefixLength = pathPrefix.length;

export default (registerReducer, getRoute) => {

  registerReducer(ROUTER_ACTION_TYPES.NAVIGATE_TO_PAGE, (state, action) =>  {
    const path = action.path;
    if (state.route.routePath === path) {
      return state;
    }

    const pa = path.substring(pathPrefixLength).split('/');
    if (pa[0] === "") {
      pa.shift();
    }
    dispatchFromReducer({
      type: ROUTER_ACTION_TYPES.SHOW_PAGE,
      path: pa,
    });
    return update(state, ['route'], {
      fromBrowser: action.fromBrowser,
      path: pa,
    })
  });

  registerReducer(ROUTER_ACTION_TYPES.SHOW_PAGE, (state, action) =>  {
    const cp = `/${action.path.join('/')}`;
    const hp = browserHistory.location.pathname;
    if (cp !== hp) {
      browserHistory.push(cp);
    }
    return state;
  });

  browserHistory.listen((location, action) => {
    // location is an object like window.location
    logger.info("Back in history to", location.pathname);
    setTimeout(() => navigateToPage(location.pathname, true));
  });

}
