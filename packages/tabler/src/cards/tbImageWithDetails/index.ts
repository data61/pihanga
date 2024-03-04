import { registerActions, PiRegister, PiMapProps, PiCardDef, ReduxAction, ReduxState } from '@pihanga/core';
import { Component } from './tbImgWDetail.component';
import type { ComponentProps } from './tbImgWDetail.component';
import type { HideDetailsEvent, ShowDetailsEvent } from './tbImgWDetail.component';

const CARD_TYPE = 'TbImageWithDetails';

export function TbImageWithDetails<S, C>(p: PiMapProps<ComponentProps, S, C>): PiCardDef {
  return {
    ...p,
    cardType: CARD_TYPE,
  }
}

export const ACTION_TYPES = registerActions('TB_IMGWDET', [
  'SHOW_DETAILS',
  'HIDE_DETAILS',
]) as {
  SHOW_DETAILS: string;
  HIDE_DETAILS: string;
};

export function onTbImageWithDetailsShowDetail<S extends ReduxState>(register: PiRegister, f: (state: S, ev: ShowDetailsEvent) => S) {
  register.reducer<S, ReduxAction & ShowDetailsEvent>(ACTION_TYPES.SHOW_DETAILS, f)
}
export function onTbImageWithDetailsHideDetail<S extends ReduxState>(register: PiRegister, f: (state: S, ev: HideDetailsEvent) => S) {
  register.reducer<S, ReduxAction & HideDetailsEvent>(ACTION_TYPES.HIDE_DETAILS, f)
}

export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: {
      onShowDetails: ACTION_TYPES.SHOW_DETAILS,
      onHideDetails: ACTION_TYPES.HIDE_DETAILS,
    },
  });
}
