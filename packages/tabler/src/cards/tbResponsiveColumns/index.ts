import { PiCardDef, PiMapProps, PiRegister } from '@pihanga/core';
import { Component } from './tbRespColumns.component';
import type { ComponentProps } from './tbRespColumns.component';
export type { TbColumnCard } from './tbRespColumns.component';

const CARD_TYPE = 'TbResonsiveColumns';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbResponsiveColumns<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: CARD_TYPE,
  }
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
  });
}
