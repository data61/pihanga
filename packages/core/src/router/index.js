import { createBrowserHistory } from 'history';

import initReducers from './router.reducers';

export { ACTION_TYPES as ROUTER_ACTION_TYPES, navigateToPage } from './router.actions';
export const browserHistory = createBrowserHistory();
 
export function init(registerReducer, opts) {
  initReducers(registerReducer, browserHistory, opts);
}
