import { registerActions, PiRegister, createCardDeclaration, createOnAction, actionTypesToEvents } from '@pihanga/core';

import { Component } from './imageCard.component';
import type { ComponentProps, ClickEvent } from './imageCard.component';

export const CARD_TYPE = 'PI_IMAGE_CARD';
export const PiImageCard = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions('PiImg', [
  'CLICKED',
])

export const onClicked = createOnAction<ClickEvent>(ACTION_TYPES.CLICKED)


export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
