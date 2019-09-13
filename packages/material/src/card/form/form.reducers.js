import { update } from '@pihanga/core';

import { ACTION_TYPES } from './form.actions';

export default (registerReducer) => {
  // eslint-disable-next-line arrow-body-style
  registerReducer(ACTION_TYPES.VALUE_CHANGED, (state, action) => {
    return update(state, ['pihanga', action.id, 'values', action.fieldID], action.value);
  });
};
