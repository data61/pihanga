
// Import all top level modules for web pack to find
import './index.css';

import { ACTION_TYPES as APP_ACTION_TYPES } from './app.actions';

import initReducers from './app.reducers';
import { APP_ROUTING } from './app.routing';

export { default as AppComponent } from './app.component';
export { reloadBackend, navigateToPage, createScratch } from './app.actions';

export const ACTION_TYPES = {
  ...APP_ACTION_TYPES,
};

/**
 * Register all reducers to interact between components
 */
export function init(register) {
  initReducers(register.reducer);
  register.routing(APP_ROUTING);
}
