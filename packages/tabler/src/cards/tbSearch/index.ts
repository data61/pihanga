import { registerActions, PiRegister } from '@pihanga/core';
import { Component } from './tbSearch.component';
export type { ComponentProps as TbSearchProps } from './tbSearch.component';

export const TB_SEARCH_CT = 'TbSearch';
export const TB_SEARCH_AT = registerActions('TBSEARCH', [
  'SUBMITTED',
  'UPDATED',
]) as {
  SUBMITTED: string;
  UPDATED: string;
};

export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_SEARCH_CT,
    component: Component,
    events: {
      onSubmit: TB_SEARCH_AT.SUBMITTED,
      onUpdate: TB_SEARCH_AT.UPDATED,
    },
  });
}
