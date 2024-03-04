import { PiCardDef, PiMapProps, PiRegister } from '@pihanga/core';
import { Component } from './tbSpinner.component';
import type { ComponentProps } from './tbSpinner.component';
export { SpinnerColor, SpinnerSize } from './tbSpinner.component';

export const TB_SPINNER_CT = 'TbSpinner';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbSpinner<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: TB_SPINNER_CT,
  }
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_SPINNER_CT,
    component: Component,
  });
}
