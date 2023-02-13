import { update } from '@pihanga/core';

import { ACTION_TYPES } from './nav-drawer.actions';

export default (registerReducer) => {
  function drawerState(drawerIsOpen, state, action) {
    return update(state, ['pihanga', action.id], { drawerIsOpen });
  }

  registerReducer(ACTION_TYPES.OPEN_DRAWER, (state, action) => drawerState(true, state, action));
  registerReducer(ACTION_TYPES.CLOSE_DRAWER, (state, action) => drawerState(false, state, action));
};
