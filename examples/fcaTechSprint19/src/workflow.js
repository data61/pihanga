import { update } from '@pihanga/core';
import { backendGET } from '@pihanga/core';

import { ACTION_TYPES as ANSWER_TYPES } from 'answer';
import { ACTION_TYPES as FORM_TYPES } from '@pihanga/material-ui/lib/card/form';
import { ACTION_TYPES as SPINNER_TYPES } from 'spinner';

const Domain = 'BACKEND:';

function getPassportCountURL(id) {
  return `/passport/${id}`;
}

export const ACTION_TYPES = {
  GET_PASSPORT: `${Domain}GET_PASSPORT`,
  GET_PASSPORT_FAILED: `${Domain}GET_PASSPORT_FAILED`,
  UPDATE_PASSPORT: `${Domain}UPDATE_PASSPORT`,
};

const getPassportCount = backendGET(getPassportCountURL, 
  ACTION_TYPES.GET_PASSPORT, 
  ACTION_TYPES.UPDATE_PASSPORT, 
  ACTION_TYPES.GET_PASSPORT_FAILED);

export function init(register) {
  register.reducer(ANSWER_TYPES.NEW_REQUEST, (state) => {
    return update(state, ['step'], 'passport');
  });
  register.reducer(SPINNER_TYPES.CANCEL_REQUEST, (state) => {
    return update(state, ['step'], 'passport');
  });
  register.reducer(FORM_TYPES.FORM_SUBMIT, (state,action) => {
    setTimeout(() => {
      getPassportCount(action.passport || 999);
    });
    const s = update(state, ['step'], 'spinner');
    return update(s, ['question'], action.question);
  });

  register.reducer(ACTION_TYPES.UPDATE_PASSPORT, (state, action) => {
    const s = update(state, ['step'], 'answer');
    return update(s, ['answer'], action.reply);
  });
}
