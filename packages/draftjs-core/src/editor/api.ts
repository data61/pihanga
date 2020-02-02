import {
  registerActions,
  update,
  dispatch,
  dispatchFromReducer,
  getCardState,
  ReduxState,
  PiRegister,
  createLogger,
  ReduxAction,
} from '@pihanga/core';
import {
  EditorState,
  ContentState,
  EditorChangeType,
  SelectionState,
  DraftHandleValue,
  ContentBlock,
} from 'draft-js';

import {
  EditorComponent,
  BlockType2Renderer,
  HandleReturnExtensions,
  HandleBeforeInputExtensions,
  HandleKeyCommandExtensions,
} from './editor.component';
import Decorator, { DECORATORS } from './decorator';
import { createContentState, persistState } from './persist';
import { initializeCatalog, getCatalog } from '../util';
// the following is weird but required by Create React App forcing "isolatedModules": true in tsconfig to true
// See https://github.com/facebook/create-react-app/issues/6054
import { DecoratorDeclaration as DD, DecorationMapper as DM, DecoratorClassDef as DC } from './decorator';
import { ACTION_TYPES } from '.';

const logger = createLogger('PiEditor');

/* ======================
 * TYPES
 */

export type DecoratorDeclaration = DD;
export type DecorationMapper = DM;
export type DecoratorClassDef = DC;

export { default as handleReturn } from './handleReturn';

// defined in @types/draft-js, but apparently not exported
export type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;

export type PiEditorRxState = {
  editorID: string;
  documentID?: string;
  autoSave?: boolean;
  catalogKey?: string;
  stateSaved?: boolean;
  stateLastSaved?: number;
  saveIntervalMS?: number; // msec to wait before persisting current editor state
  plugins?: unknown;
  editorState?: EditorState;
}

export type EditorSelection = {
  anchorKey: string;
  anchorOffset: number;
  focusKey?: string;
  focusOffset: number;
};

export type PiEditorAction = ReduxAction & {
  id?: string; // editor name
  editorID: string;
  documentID: string; // assumed to be under 'documents'
};

export type PiEditorActionOpen = PiEditorAction & {
};

export type PiEditorActionLoad = PiEditorAction & {
};

export type PiEditorActionUpdate = PiEditorAction & {
  editorState: EditorState;
  blocksChanged: string[];
};

export type PiEditorActionSave = PiEditorAction & {
  editorID: string;
};

export type PiEditorExtension = {
  handleReturn?: HandleReturnFn;
  handleBeforeInput?: HandleBeforeInputFn<any>;
  handleKeyCommand?: HandleKeyCommandFn;
};

export type HandleReturnFn = (
  event: SyntheticKeyboardEvent,
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps: unknown
) => [boolean, EditorState];

export type HandleBeforeInputFn<P> = (
  chars: string,
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps: P,
) => [DraftHandleValue|undefined, EditorState];

export type HandleKeyCommandFn = (
  command: string,
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps: unknown
) => [DraftHandleValue|undefined, EditorState]

export type BlockRendererFn<P, T extends PiComponentProps> = (
  block: ContentBlock,
  editorID: string,
  documentID: string,
  readOnly: boolean, // editor's default setting
  extProps: P,
) => BlockRenderDef<T> | null;

export type BlockRenderDef<T extends PiComponentProps> = {
  component: React.FunctionComponent<T>; // BlockRenderOpts
  editable: boolean;
  props: {[key: string]: unknown};
};

export type BlockRenderOpts = {[key: string]: unknown}; // TODO: May want to flesh out 'unknown'

// don't understand generics enough to deal with this right now - 'any' to the rescue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockRendererFnMap = {[key: string]: BlockRendererFn<any, any>};

export type PiComponentProps = {[key: string]: unknown};

/* ==========================
 * FUNCTIONS
 */

export function getEditorRedux<S extends ReduxState>(editorID: string, state: S): PiEditorRxState {
  const rs = state[editorID] as PiEditorRxState;
  return rs;
}

export function getEditorStateFromRedux<S extends ReduxState>(
  editorID: string,
  state: S,
): EditorState {
  const erx = getEditorRedux(editorID, state).editorState;
  if (!erx) {
    throw Error('Missing \'editorState\' state in PiEditorRxState');
  }
  return erx;
}

export function getDocumentIDFromRedux<S extends ReduxState>(
  editorID: string,
  state: S,
): string {
  return getEditorRedux(editorID, state).documentID || '';
}

export function updateEditorStateInRedux<S extends ReduxState>(
  editorState: EditorState,
  editorID: string,
  state: S,
): S {
  const rs = getEditorRedux(editorID, state);
  if (editorState === rs.editorState) {
    return state;
  } else {
    setTimeout(() => {
      reportEditorStateUpdate(editorState, rs.editorState, editorID, rs.documentID);
    }, 0);
    return update(state, [editorID], { editorState }) as S;
  }
}

export function reportEditorStateUpdate(
  editorState: EditorState,
  oldEditorState: EditorState | undefined,
  editorID: string,
  documentID: string | undefined,
  catalogKey?: string,
): void {
  const cs = editorState.getCurrentContent();
  const bm = cs.getBlockMap();
  let changed = false;
  const blocksChanged = [] as string[];
  const origCS = oldEditorState ? oldEditorState.getCurrentContent() : null;
  const origBM = origCS ? origCS.getBlockMap() : null;
  const bm2 = bm.map((block) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const b = block!;
    const bk = b.getKey();
    if (!origBM || b !== origBM.get(bk)) {
      blocksChanged.push(bk);
      changed = true;
    }
    const d = b.getData();
    if (d.get('CATALOG_KEY')) {
      return b;
    } else {
      if (catalogKey) {
        const d2 = d.set('CATALOG_KEY', catalogKey);
        changed = true;
        return b.merge({ data: d2 });
      }
      // could potentially get with getCatalogKey()
      // eslint-disable-next-line no-console
      console.warn('Reporting editor state without CATALOG_KEY');
      return b;
    }
  });
  let es2 = editorState;
  if (changed) {
    const cs2 = cs.merge({ blockMap: bm2 }) as ContentState;
    es2 = EditorState.push(editorState, cs2, 'change-block-data');
  }

  const entitiesHaveChanged = !origCS || getCatalog(cs) !== getCatalog(origCS);
  if (es2 !== oldEditorState || entitiesHaveChanged) {
    dispatch({
      type: ACTION_TYPES.UPDATE,
      id: editorID,
      editorID,
      documentID,
      editorState: es2,
      blocksChanged,
      entitiesHaveChanged,
      editorStateHasChanged: es2 === editorState,
    });
  }
}

export function setActivePopper<S extends ReduxState>(
  state: S,
  editorID: string,
  popper: string|undefined,
): S {
  return update(state, ['pihanga', editorID], { activePopper: popper }) as S;
}

export function cardNameForPluginType(
  pluginType: string,
  editorID: string,
  state: ReduxState,
): string | undefined {
  const plugins = getCardState(editorID, state).plugins as {[key: string]: string}[];
  const p = plugins.find((e) => e.type === pluginType);
  return p ? p.cardName : undefined;
}

export function registerDecorator(name: string, declaration: DecoratorDeclaration): void {
  const dh = DECORATORS as {[key: string]: DecoratorDeclaration};
  if (dh[name]) {
    logger.warn(`Duplicate decorator defintion '${name}'`);
  }
  dh[name] = declaration; // as unknown;
}

// don't understand generics enough to deal with this right now - 'any' to the rescue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerBlockRenderer(type: string, renderFn: BlockRendererFn<any, any>): void {
  const bt2r = BlockType2Renderer;
  if (bt2r[type]) {
    logger.warn(`Duplicate block renderer defintion '${type}'`);
  }
  bt2r[type] = renderFn;
}

export function registerExtensions(name: string, extensions: PiEditorExtension): void {
  if (extensions.handleReturn) {
    const re = HandleReturnExtensions;
    re.unshift({ name, f: extensions.handleReturn });
  }
  if (extensions.handleBeforeInput) {
    const ha = HandleBeforeInputExtensions;
    ha.unshift({ name, f: extensions.handleBeforeInput });
  }
  if (extensions.handleKeyCommand) {
    const ha = HandleKeyCommandExtensions;
    ha.unshift({ name, f: extensions.handleKeyCommand });
  }
}

export function removeSelection(
  eState: EditorState,
  contentState: ContentState,
  changeType: EditorChangeType,
  selection: SelectionState,
): EditorState {
  const eState2 = EditorState.push(eState, contentState, changeType);
  const sel = selection.merge({
    anchorKey: selection.getFocusKey(), anchorOffset: selection.getFocusOffset(),
  }) as SelectionState;
  return EditorState.forceSelection(eState2, sel);
}
