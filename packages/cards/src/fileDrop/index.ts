import { registerActions, PiRegister, createCardDeclaration, createOnAction, actionTypesToEvents } from '@pihanga/core';

import { Component } from './fileDrop.component';
import type { ComponentProps, SomeEvent } from './fileDrop.component';

export const CARD_TYPE = 'PiFileDrop';
export const PiFileDrop = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions('PiFD', [
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
