import { registerActions, PiRegister, createCardDeclaration, createOnAction, actionTypesToEvents } from '@pihanga/core';

import { Component } from './page.component';
import type { ComponentProps, SomeEvent } from './page.component';

export const CARD_TYPE = 'EcXXX';
export const TbDataGrid = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions('NSXXX', [
  'SOMETHING',
])

export const onXXX = createOnAction<SomeEvent>(ACTION_TYPES.SOMETHING)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
