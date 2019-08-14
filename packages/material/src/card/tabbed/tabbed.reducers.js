import { update } from '@pihanga/core';

import { ACTION_TYPES } from './tabbed.actions';

export default (registerReducer) => {

  registerReducer(ACTION_TYPES.TAB_SELECTED, (state, action) => {
    return update(state, [ 'pihanga', action.cardName ], { tabId: action.tabId });
  });
}
