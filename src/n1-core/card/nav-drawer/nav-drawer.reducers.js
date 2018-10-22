import update from 'immutability-helper';

import { ACTION_TYPES } from './nav-drawer.actions';

export default (registerReducer) => {

  registerReducer(ACTION_TYPES.OPEN_DRAWER, (state, action) => {
    return drawerState(state, true);
  });

  registerReducer(ACTION_TYPES.CLOSE_DRAWER, (state, action) => {
    return drawerState(state, false, action.cardName);
  })

  function drawerState(state, isOpen, cardName) {
    return update(ensurePage(state), {
      page: { drawerOpen: { $set: isOpen } }
    });
  }

  function ensurePage(state) {
    if (state.page) return state;
    return update(state, {
      page: { $set: {} },
    });
  }

}
