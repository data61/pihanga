import { PiRegister, createCardDeclaration } from '@pihanga/core';
import { Component } from './flexGrid.component';
import type { ComponentProps } from './flexGrid.component';

export const CARD_TYPE = 'PiFlexGrid';
export const PiFlexGrid = createCardDeclaration<ComponentProps>(CARD_TYPE)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: {},
  });
}
