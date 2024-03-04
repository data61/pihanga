import { PiRegister, PiMapProps, PiCardDef } from '@pihanga/core';
import type { ComponentProps } from './piSwitcher.component';
import { Component } from './piSwitcher.component';
const CARD_NAME = 'PiSwitcher';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function PiSwitcher<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: CARD_NAME,
  }
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_NAME,
    component: Component,
    events: {},
  });
}
