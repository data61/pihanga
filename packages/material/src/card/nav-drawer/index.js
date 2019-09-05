import initReducers from './nav-drawer.reducers';
import { NavDrawerCard } from './nav-drawer.component';
import { ACTION_TYPES } from './nav-drawer.actions';

export * from './nav-drawer.actions';

export function init(register) {
  initReducers(register.reducer);
  register.cardComponent({
    name: 'PiNavDrawer',
    component: NavDrawerCard,
    actions: ACTION_TYPES,
    events: {
      onOpenDrawer: ACTION_TYPES.OPEN_DRAWER,
      onCloseDrawer: ACTION_TYPES.CLOSE_DRAWER,
      onClickNavMenu: ACTION_TYPES.NAV_REQUEST,
    },
  });
}
