import { PiRegister, createCardDeclaration } from '@pihanga/core';

import { Component } from './markdown.component';
import type { ComponentProps } from './markdown.component';

export const CARD_TYPE = 'PiMarkdown';
export const PiMarkdown = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    // events: actionTypesToEvents(ACTION_TYPES),
  });
}
