
export declare function addCard(cardName: string, cardDef: {cardType: string} & {[key:string]:string}): void;
export declare function registerActions(domain: string, names: string[]): {[key:string]:string};
export function actions(name: string): {[key:string]: string};
export function actions(namespace: string, name:string): string;
export function action(namespace: string, name:string): string;

export declare function dispatch<T extends ReduxAction>(action: T): void;
export declare function dispatch<T>(actionType: string, props:  T): void;
export declare function dispatch(domain: string, actionType: string, props:  {[key:string]:any}): void;

export declare function dispatchFromReducer<T extends ReduxAction>(action: T): void;
// export declare function dispatchFromReducer(actionType: string, props:  {[key:string]:any}): void;
export declare function dispatchFromReducer<T extends {[key:string]:any}>(actionType: string, props: T): void;
export declare function dispatchFromReducer<T extends {[key:string]:any}>(domain: string, actionType: string, props: T): void;

export declare function update(state: ReduxState, path: string[], partial: any): ReduxState;

export declare function getState():ReduxState;
export declare function getPihangaState<T>(name: string, state?: ReduxState): T;
export declare function updatePihangaState(state: ReduxState, name: string, path: string[], partial: any): ReduxState;

export declare function registerGET(props: PiRegisterGetProps): void;
export declare function registerPUT(props: PiRegisterPutProps): void;
export declare function registerPOST(props: PiRegisterPostProps): void;

export declare function getCardState(cardName:string, state: ReduxState): PiCardState;
export declare function createLogger(name:string):any;
export declare function getParamValue(
  paramName: string,  
  cardName: string, 
  state: ReduxState, 
  ctxtProps?: {[k: string]: unknown}, 
  includeDefaults?: boolean,
)

type ReactComponent = any; //({[key:string]:any}) => any
type ReduxState = {
  pihanga?: {[key:string]:any},
};
type ReduxAction = {
  type: string,
};

type PiCardState = {[key:string]: any}

type CardOpts = {
  cardName: string,
}
export declare function Card(opts: CardOpts & {[key:string]:any}): any;

interface PiRegister {
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
  metaCard(type: string, transformF: PiMetaTransformerF): void;

  reducer<S extends ReduxState, A extends ReduxAction>(eventType: string, mapper: (state: S, action: A) => S, priority?: number): void,
}

type PiRegisterComponent = {
  name: string,
  component: ReactComponent, 
  events?: {[key:string]:string},
  defaults?: {[key:string]:any},
};

type PiMetaTransformerF = (
  name: string,
  opts: {[name:string]:any},
) => {[name:string]:{[prop:string]:any}};

type PiUrlBindings = {[key:string]:string|number};
type PiRestRequestBody = {[key:string]:any};

type PiRegisterGetProps = {
  name: string,
  url: string,
  trigger: string,
  guard?: (action: ReduxAction, state: ReduxState) => boolean,
  request: (action: ReduxAction, state: ReduxState, variables: string[]) => PiUrlBindings,
  reply: (state: ReduxState, reply: any, requestAction: ReduxAction) => ReduxState,
  error: (state: ReduxState, reply: any, requestAction: ReduxAction) => ReduxState,
};

type PiRegisterPostProps = PiRegisterPostPutProps;
type PiRegisterPutProps = PiRegisterPostPutProps;
type PiRegisterPostPutProps = {
  name: string,
  url: string,
  trigger: string,
  guard?: (action: ReduxAction, state: ReduxState) => boolean,
  request: (action: ReduxAction, state: ReduxState, variables: string[]) => [PiRestRequestBody, PiUrlBindings],
  reply: (state: ReduxState, reply: any, requestAction: ReduxAction) => ReduxState,
  error: (state: ReduxState, reply: any, requestAction: ReduxAction) => ReduxState,
};
