import { PiCardDef, PiMapProps, PiRegister, ReduxAction, ReduxState, actionTypesToEvents, createOnAction, registerActions } from '@pihanga/core';
import { AuthProviderLoginEvent, Component, LoginTokenEvent, SignupEvent } from './tbLoginPage.component';
import type { ComponentProps, LoginPasswordEvent } from './tbLoginPage.component';

// export type { DataGridEl } from './tbLoginPage.component';
// export { DataGridElType } from './tbLoginPage.component';

const TB_LOGIN_PAGE_CT = 'TbLoginPage';

type CardProps<S> = PiMapProps<ComponentProps, S>;
export function TbLoginPage<S>(p: CardProps<S>): PiCardDef {
  return {
    ...p,
    cardType: TB_LOGIN_PAGE_CT,
  }
}

const ACTION_TYPES = registerActions('TB_LOGIN', [
  'LOGIN_PASSWORD',
  'LOGIN_TOKEN',
  'AUTH_PROVIDER',
  'SIGN_UP'
]);

export const onTbLoginPassword = createOnAction<LoginPasswordEvent>(ACTION_TYPES.LOGIN_PASSWORD)
// export function onTbLoginPassword<S extends ReduxState>(
//   register: PiRegister,
//   f: (state: S, ev: ReduxAction & LoginPasswordEvent) => S
// ) {
//   register.reducer<S, ReduxAction & LoginPasswordEvent>(ACTION_TYPES.LOGIN_PASSWORD, f)
// }

export const onTbLoginToken = createOnAction<LoginTokenEvent>(ACTION_TYPES.LOGIN_TOKEN)
// export function onTbLoginToken<S extends ReduxState>(
//   register: PiRegister,
//   f: (state: S, ev: ReduxAction & LoginTokenEvent) => S
// ) {
//   register.reducer<S, ReduxAction & LoginTokenEvent>(ACTION_TYPES.LOGIN_TOKEN, f)
// }

export const onTbLoginAuthProvider = createOnAction<AuthProviderLoginEvent>(ACTION_TYPES.AUTH_PROVIDER)
// export function onTbLoginAuthProvider<S extends ReduxState>(
//   register: PiRegister,
//   f: (state: S, ev: ReduxAction & AuthProviderLoginEvent) => S
// ) {
//   register.reducer<S, ReduxAction & AuthProviderLoginEvent>(ACTION_TYPES.AUTH_PROVIDER, f)
// }

export const onTbLoginSignup = createOnAction<SignupEvent>(ACTION_TYPES.SIGN_UP)
// export function onTbLoginSignup<S extends ReduxState>(
//   register: PiRegister,
//   f: (state: S, ev: ReduxAction & SignupEvent) => S
// ) {
//   register.reducer<S, ReduxAction & SignupEvent>(ACTION_TYPES.SIGN_UP, f)
// }


export function init(register: PiRegister): void {
  register.cardComponent({
    name: TB_LOGIN_PAGE_CT,
    component: Component,
    events: actionTypesToEvents(ACTION_TYPES),
  });
}
