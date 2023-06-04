import { PiRegister, PiMapProps, PiCardDef, ReduxState, registerActions, actionTypesToEvents, createOnAction } from '@pihanga/core';
import { Component, LogoutEvent } from './page.component';
import type { ComponentProps } from './page.component';

const TB_PAGE_CT = 'TbPage';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbPage<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: TB_PAGE_CT,
  }
}

export const ACTION_TYPES = registerActions('TbPage', [
  'LOGOUT',
])
export const onTbPageLogout = createOnAction<LogoutEvent>(ACTION_TYPES.LOGOUT)

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_PAGE_CT,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
