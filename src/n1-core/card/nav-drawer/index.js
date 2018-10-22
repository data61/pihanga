//import { ACTION_TYPES as PAGE_ACTION_TYPES } from './page.actions';
//import { ACTION_TYPES as USER_MENU_ACTION_TYPES } from './user-menu';
import initReducers from './nav-drawer.reducers';
import { NavDrawerCard } from './nav-drawer.component';

export * from './nav-drawer.actions';

export function init(register) {
  initReducers(register.reducer);
  register.card('NavDrawer', NavDrawerCard);
}
