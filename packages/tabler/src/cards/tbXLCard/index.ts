import { PiCardDef, PiMapProps, PiRegister } from '@pihanga/core';
import { Component } from './tablerXLCard.component';
import type { ComponentProps } from './tablerXLCard.component';

export const CARD_TYPE = 'TbXLCard';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbXlCard<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: CARD_TYPE,
  }
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: {},
  });

}
