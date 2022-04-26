import { <% if (actionDomain) { %>registerActions, <% } %>PiRegister } from '@pihanga/core';
import { Component } from './<%= filePrefix %>.component';
export type { ComponentProps } from './<%= filePrefix %>.component';

export const CARD_TYPE = '<%= cardName %>';
<% if (actionDomain) { %>export const ACTION_TYPES = registerActions('<%= actionDomain %>', [
  'FOO'
]) as {
  FOO: string;
};
<% } %>
export function init(register: PiRegister): void {
  register.cardComponent({
    name: CARD_TYPE,
    component: Component,
    events: {
      // onClickNavLink: ACTION_TYPES.NAV_REQUEST,
      // onAddNewDocument: ACTION_TYPES.ADD_NEW_DOCUMENT,
    },
  });
}
