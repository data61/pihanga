import { registerActions, PiRegister, createCardDeclaration, createOnAction, actionTypesToEvents, dispatchFromReducer, ReduxAction } from '@pihanga/core';

import { Component } from './modal.component';
import type { ComponentProps, CloseEvent } from './modal.component';

export const CARD_TYPE = 'PiModalWrapper';
export const PiModalCard = createCardDeclaration<ComponentProps>(CARD_TYPE)

export const ACTION_TYPES = registerActions('PiMd', [
  'CLOSE_REQUEST',
])

export type ModalState = {
  modalCard?: string;
  contentLabel?: string,
}

export const onModalCloseRequest = createOnAction<CloseEvent>(ACTION_TYPES.CLOSE_REQUEST)

export function closeModalRequest() {
  dispatchFromReducer({
    type: ACTION_TYPES.CLOSE_REQUEST
  } as ReduxAction & CloseEvent);
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
