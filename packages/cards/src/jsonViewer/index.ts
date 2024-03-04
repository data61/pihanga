import { PiRegister, createCardDeclaration } from '@pihanga/core';

import { Component } from './jsonViewer.component';
import type { ComponentProps, } from './jsonViewer.component';

export const CARD_TYPE = 'PiJsonViewer';
export const PiJsonViewer = createCardDeclaration<ComponentProps>(CARD_TYPE)

// export const ACTION_TYPES = registerActions('NSXXX', [
//   'SOMETHING',
// ])

// export const onXXX = createOnAction<SomeEvent>(ACTION_TYPES.SOMETHING)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    // events: actionTypesToEvents(ACTION_TYPES),
  });
}
