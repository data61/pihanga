import { update } from '@pihanga/core';
import { prettifyNumber } from '@pihanga/core';

import {  ACTION_TYPES as APP_ACTION_TYPES } from './root.actions';

export default (registerReducer) => {
  registerReducer(APP_ACTION_TYPES.CREATE_SCRATCH, (state, action) =>  {
    const path = ['scratch', ...action.path];
    const s = update(state, path, action.initial || {});
    return s;
  });
}

export function reduceOnAcceptSignOut(state) {
  return update(state, [], {
    user: {},
    scratch: {},
  });
}

export function reduceOnSessionChecked(state) {
  return update(state, [], {
    checkedSession: true,
  });
}

export function reduceOnTimeOutSessionSoon(state, action) {
  const timeLeftSec = action.timeLeftMs / 1000;

  // FIXME: we should let each UI component decide what to do with this event
  // eslint-disable-next-line no-alert
  window.confirm(
    `Your session will time out in ${prettifyNumber(timeLeftSec)} seconds. Please save your work`);

  return state;
}
