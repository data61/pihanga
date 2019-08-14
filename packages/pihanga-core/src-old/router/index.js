import initReducers from './router.reducers';

export { ACTION_TYPES as ROUTER_ACTION_TYPES, navigateToPage } from './router.actions';
export * from './router.component';
export * from './router.service';

export function init(registerReducer, getRoute) {
  initReducers(registerReducer, getRoute);
}
