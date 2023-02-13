import type PiRegister from '@pihanga/core';

declare module '@pihanga/core' {

  type PiInitF = (register: PiRegister) => void;

  type PiCardDef = {
    cardType: string;
  };

  type PiStartEnvironment = {
    API_BASE?: string;
    AUTH_TOKEN_COOKIE_NAME?: string | undefined, //'AUTH_TOKEN',
    // The value of this header will be checked by server. If missing, server will return 401 for
    // restricted access API
    AUTH_TOKEN_HEADER?: string; // 'N1-Api-Key',
  
  } & {[key: string]: any};

  type PiStartOpts<T> = {
    rootEl: HTMLElement | null;
    rootComponent: () => JSX.Element;
    inits: PiInitF[];
    initialReduxState: T;
    initialCards?: {[name: string]: PiCardDef};
    environment?: PiStartEnvironment;
  };

  export function start<T extends ReduxState>(opts: PiStartOpts<T>): void;

  // Components
  export type PiCardProps<P> = P & {
    cardName: string;
    classes: {[name:string]:string};
    children?: React.ReactNode;
  };

  /// OVERRIDE
  export type PiRegisterPostPutProps<S extends ReduxState, A extends ReduxAction, R> = {
    name: string,
    url: string,
    trigger: string,
    guard?: (action: A, state: S) => boolean,
    request: (action: A, state: S, variables: string[]) => [PiRestRequestBody, PiUrlBindings, {[k:string]:string}?],
    reply: (state: S, reply: any, requestAction: ReduxAction) => S,
    error: (state: S, reply: any, requestAction: ReduxAction) => S,
  };

  export function update<S extends ReduxState>(state: S, path: string[], partial: any): S;
};
