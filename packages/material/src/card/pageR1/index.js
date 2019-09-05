import { registerActions } from '@pihanga/core';
import { PageR1Component } from './pageR1.component';

export const ACTION_TYPES = registerActions('PAGE_R1', ['NAV_REQUEST']);

export function init(register) {
  register.cardComponent({
    name: 'PiPageR1',
    component: PageR1Component,
    actions: ACTION_TYPES,
    events: {
      onClickNavLink: ACTION_TYPES.NAV_REQUEST,
    },
  });
}
