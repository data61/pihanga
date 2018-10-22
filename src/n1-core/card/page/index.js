import { ACTION_TYPES as PAGE_ACTION_TYPES } from './page.actions';
//import { ACTION_TYPES as USER_MENU_ACTION_TYPES } from './user-menu';
import initReducers from './page.reducers';
import { PageComponent } from './page.component';

export * from './page.component';
export const ACTION_TYPES = {
  ...PAGE_ACTION_TYPES,
//  ...USER_MENU_ACTION_TYPES,
};

export function init(register) {
  initReducers(register.reducer);
  register.card('MyPageCard', PageComponent);
}
