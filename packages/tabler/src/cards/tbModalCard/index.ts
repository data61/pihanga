import { PiRegister, createCardDeclaration } from '@pihanga/core';

import { Component } from './tbModalCard.component';
import type { ComponentProps } from './tbModalCard.component';

export const CARD_TYPE = 'TbModalCard';
export const TbModalCard = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    // events: actionTypesToEvents(ACTION_TYPES),
  });
}
