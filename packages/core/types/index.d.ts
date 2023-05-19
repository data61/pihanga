import { string } from "prop-types";

type PiInitF = (register: PiRegister) => void;

type PiCardDef = {
  cardType: string;
};

// get value of property from another (or self) card in the context of 'ctxtProp'
type PiRefF = (cardName: string, propName: string) => any;

// context props given to <Card> in parent card
type PiDefCtxtProps = { [k: string]: any };
type PiCtxtProps<T = PiDefCtxtProps> = T;

type RefF = any;
type StateMapper<T, S, C = PiDefCtxtProps> = (state: S, ref: RefF, ctxtProps: C, cardName: string) => T

type PiMapProps<Type, S, C = PiDefCtxtProps> = {
  [Property in keyof Type]: Type[Property] | StateMapper<Type[Property], S, C>;
};

type PiStartEnvironment = {
  API_BASE?: string;
  AUTH_TOKEN_COOKIE_NAME?: string | undefined, //'AUTH_TOKEN',
  // The value of this header will be checked by server. If missing, server will return 401 for
  // restricted access API
  AUTH_TOKEN_HEADER?: string; // 'N1-Api-Key',
} & { [key: string]: any };

type PiStartOpts<T> = {
  rootEl: HTMLElement | null;
  rootComponent: () => JSX.Element;
  inits: PiInitF[];
  initialReduxState: T;
  initialCards?: { [name: string]: PiCardDef };
  environment?: PiStartEnvironment;
};

// Components
export type PiCardProps<P> = P & {
  cardName: string;
  classes: { [name: string]: string };
  children?: React.ReactNode;
};

export type PiCardSimpleProps<P> = P & {
  cardName: string;
  children?: React.ReactNode;
};

export declare function start<T extends ReduxState>(opts: PiStartOpts<T>): void;

export declare function addCard<T>(cardName: string, cardDef: { cardType: string } & T): void;
export declare function createCardDeclaration<C, P = PiDefCtxtProps>(cardType: string): <S>(p: PiMapProps<C, S, P>) => PiCardDef;

export declare function registerActions(domain: string, names: string[]): { [key: string]: string };
export function actions(name: string): { [key: string]: string };
export function actions(namespace: string, name: string): string;
export function action(namespace: string, name: string): string;

export declare function createOnAction<E>(actionType: string):
  <S extends ReduxState>(register: PiRegister, f: (state: S, ev: CardAction & E) => S) => void;
export declare function actionTypesToEvents(actionTypes: { [k: string]: string }): { [k: string]: string };

export declare function dispatch<T extends ReduxAction>(action: T): void;
export declare function dispatch<T>(actionType: string, props: T): void;
export declare function dispatch(domain: string, actionType: string, props: { [key: string]: any }): void;

export declare function dispatchFromReducer<T extends ReduxAction>(action: T): void;
// export declare function dispatchFromReducer(actionType: string, props:  {[key:string]:any}): void;
export declare function dispatchFromReducer<T extends { [key: string]: any }>(actionType: string, props: T): void;
export declare function dispatchFromReducer<T extends { [key: string]: any }>(domain: string, actionType: string, props: T): void;

export declare function update<S extends ReduxState>(state: S, path: string[], partial: any): S;

export declare function getState(): ReduxState;
export declare function getPihangaState<T>(name: string, state?: ReduxState): T;
export declare function updatePihangaState(state: ReduxState, name: string, path: string[], partial: any): ReduxState;

export declare function registerGET<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterGetProps<S, A, R>): void;
export declare function registerPUT<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterPutProps<S, A, R>): void;
export declare function registerPOST<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterPostProps<S, A, R>): void;

export declare function getCardState(cardName: string, state: ReduxState): PiCardState;
export declare function createLogger(name: string): any;
export declare function getParamValue(
  paramName: string,
  cardName: string,
  state: ReduxState,
  ctxtProps?: { [k: string]: any },
  includeDefaults?: boolean,
)
export declare function ref<T>(
  cardNameOrF: CardNameOrFunction,
  paramName: string,
): T;

export type Ref<T> = (
  cardNameOrF: CardNameOrFunction,
  paramName: string,
) => T;

type ReactComponent = any; //({[key:string]:any}) => any
export type ReduxState = {
  pihanga?: { [key: string]: any },
};
export type ReduxAction = {
  type: string,
};
export type CardAction = ReduxAction & {
  cardID: string;
}
export type ReduxActionExt = ReduxAction & { [k: string]: any };

type PiCardState = { [key: string]: any }

type CardOpts = {
  cardName: string,
}
export declare function Card(opts: CardOpts & { [key: string]: any }): any;

export interface PiRegister {
  cardComponent(declaration: PiRegisterComponent): void,

  /**
   * Register a meta card which expands a single card definition of type `name`
   * into a new set of cards which can be registered in turn through `registerCards`.
   * 
   * The `transformF` function takes the `cardName` and `cardDef` as the two paramters
   * and is expected to return a map where the keys are new card anmes and their respective
   * values the respective card declaration.
   * 
   * @param {string} type 
   * @param {function} transformF 
   */
  metaCard<T>(type: string, transformF: PiMetaTransformerF<T>): void;

  registerGET<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterGetProps<S, A, R>): void;
  registerPUT<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterPutProps<S, A, R>): void;
  registerPOST<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterPostProps<S, A, R>): void;
  registerPeriodicGET<S extends ReduxState, A extends ReduxAction, R>(props: PiRegisterPeridicGetProps<S, A, R>): void;

  reducer<S extends ReduxState, A extends ReduxAction>(eventType: string, mapper: (state: S, action: A) => S, priority?: number): void,
  reducerAllStart<S extends ReduxState, A extends ReduxAction>(mapper: (state: S, action: A) => S): void,
  reducerAllEnd<S extends ReduxState, A extends ReduxAction>(mapper: (state: S, action: A) => S): void,
}

type PiRegisterComponent = {
  name: string,
  component: ReactComponent,
  events?: { [key: string]: string },
  defaults?: { [key: string]: any },
};

export type PiMetaTransformerF<T> = (
  name: string,
  opts: T
) => { [name: string]: { [prop: string]: any } };

type PiUrlVars = { [key: string]: string | number };
type PiUrlHeaders = { [key: string]: string | number };
type PiUrlBindings = PiUrlVars | [PiUrlVars, PiUrlHeaders];
type PiRestRequestBody = { [key: string]: any };

type PiRegisterGetProps<S extends ReduxState, A extends ReduxAction, R> = {
  name: string,
  url: string,
  throttleMS?: number, // thottle delay in ms
  trigger: string,
  guard?: (action: A, state: S) => boolean,
  request: (action: A, state: S, variables: string[]) => PiUrlVars | string | undefined,
  headers?: (action: A, state: S, variables: string[]) => { [key: string]: string },
  reply: (state: S, reply: R, requestAction: A, contentType: string) => S,
  error: (state: S, reply: R, requestAction: A) => S,
};
type PiRegisterPeriodicGetProps<S extends ReduxState, A extends ReduxAction, R> = {
  name: string,
  url: string,
  intervalMS?: number, // interval in ms
  startTrigger: string,
  init?: (action: A, state: S) => S,
  request: (action: A, state: S, variables: string[]) => PiUrlVars | string | undefined,
  //headers?: (action: A, state: S, variables: string[]) => { [key: string]: string },
  reply: (state: S, reply: R, requestAction: A, contentType: string) => S,
  error: (state: S, reply: R, requestAction: A) => S,
};

type PiRegisterPostProps<S extends ReduxState, A extends ReduxAction, R> = PiRegisterPostPutProps<S, A, R>;
type PiRegisterPutProps<S extends ReduxState, A extends ReduxAction, R> = PiRegisterPostPutProps<S, A, R>;
type PiRegisterPostPutProps<S extends ReduxState, A extends ReduxAction, R> = {
  name: string,
  url: string,
  trigger: string,
  guard?: (action: A, state: S) => boolean,
  request: (action: A, state: S, variables: string[]) => [PiRestRequestBody, PiUrlBindings, { [k: string]: string }?],
  reply: (state: S, reply: any, requestAction: ReduxAction, contentType: string) => S,
  error: (state: S, reply: any, requestAction: ReduxAction) => S,
};

type CardNameOrFunction = string
  | ((state: ReduxState, ctxtProps: { [k: string]: any }) => string);
