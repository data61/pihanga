import { update } from '@pihanga/core';
import { actions, registerGET } from '@pihanga/core';

import { ACTION_TYPES as ANSWER_TYPES } from 'answer';
import { ACTION_TYPES as SPINNER_TYPES } from 'spinner';

export function init(register) {

  registerGET({
    name: 'verifyPassport',
    url: '/passport/:id',
    trigger: actions('PiForm').FORM_SUBMIT,
    request: (action) => {
      return {id: action.passport || 999};
    },
    reply: (state, reply) => {
      const s = update(state, ['step'], 'answer');
      return update(s, ['answer'], reply);
    },
  });

  register.reducer(ANSWER_TYPES.NEW_REQUEST, (state) => {
    return update(state, ['step'], 'passport');
  });
  register.reducer(SPINNER_TYPES.CANCEL_REQUEST, (state) => {
    return update(state, ['step'], 'passport');
  });
  register.reducer(actions('PiForm').FORM_SUBMIT, (state,action) => {
    const s = update(state, ['step'], 'spinner');
    return update(s, ['question'], action.question);
  });
}
