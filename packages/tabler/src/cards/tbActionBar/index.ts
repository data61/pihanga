import { registerActions, PiRegister, ReduxState, PiMapProps, PiCardDef, ReduxAction } from '@pihanga/core';
import { Component } from './actionBar.component';
import type { ComponentProps, SelectEvent } from './actionBar.component';

export const CARD_TYPE = 'TbActionBar';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbActionBar<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: CARD_TYPE,
  }
}

export const ACTION_TYPES = registerActions('TBABAR', [
  'SELECT'
]) as {
  SELECT: string;
};

export function onTbActionBarSelect<S extends ReduxState>(register: PiRegister, f: (state: S, ev: SelectEvent) => S) {
  register.reducer<S, ReduxAction & SelectEvent>(ACTION_TYPES.SELECT, f)
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: {
      onSelect: ACTION_TYPES.SELECT,
      // onAddNewDocument: ACTION_TYPES.ADD_NEW_DOCUMENT,
    },
  });
}
