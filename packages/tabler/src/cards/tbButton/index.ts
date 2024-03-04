import { registerActions, PiRegister, PiMapProps, PiCardDef, ReduxState, ReduxAction } from '@pihanga/core';
import { ButtonClickedEvent, Component } from './tbButton.component';
import type { ComponentProps } from './tbButton.component';

const TB_BUTTON_CT = 'TbButton';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbButton<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: TB_BUTTON_CT,
  }
}

const ACTION_TYPES = registerActions('TBBUTTON', [
  'CLICKED',
]) as {
  CLICKED: string;
};

export function onTbButtonClicked<S extends ReduxState>(
  register: PiRegister,
  f: (state: S, ev: ReduxAction & ButtonClickedEvent) => S
) {
  register.reducer<S, ReduxAction & ButtonClickedEvent>(ACTION_TYPES.CLICKED, f)
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_BUTTON_CT,
    component: Component,
    events: {
      onClicked: ACTION_TYPES.CLICKED,
    },
  });
}
