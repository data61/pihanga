import { update } from 'n1-core';

import { ACTION_TYPES } from './nav-drawer.actions';

export default (registerReducer) => {

  registerReducer(ACTION_TYPES.OPEN_DRAWER, (state, action) => {
    return drawerState(true, state, action);
  });

  registerReducer(ACTION_TYPES.CLOSE_DRAWER, (state, action) => {
    return drawerState(false, state, action);
  })

  function drawerState(drawerIsOpen, state, action) {
    return update(state, [ 'pihanga', action.id ], {drawerIsOpen});
  }


}
