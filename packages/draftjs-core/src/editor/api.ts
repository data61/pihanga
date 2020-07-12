import {
  update,
  dispatch,
  getCardState,
  ReduxState,
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
  BlockType2Renderer,
  HandleReturnExtensions,
  HandleBeforeInputExtensions,
  HandleKeyCommandExtensions,
  KeyBindingFnExtensions,
} from './editor.component';

import { getCatalog } from '../util';
// the following is weird but required by Create React App forcing "isolatedModules": true
// in tsconfig to true
// See https://github.com/facebook/create-react-app/issues/6054
import {
  DECORATORS,
  DecoratorDeclaration as DD,
  DecorationMapper as DM,
  DecoratorClassDef as DC,
} from './decorator';
import { ACTION_TYPES } from '.';

const logger = createLogger('PiEditor');

/* ======================
 * TYPES
 */

export type DecoratorDeclaration = DD;
export type DecorationMapper = DM;
export type DecoratorClassDef = DC;

// defined in @types/draft-js, but apparently not exported
export type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;

export type PiEditorRxState = {
  editorID: string;
  documentID?: string;
  autoSave?: boolean;
  catalogKey?: string;
  stateSaveRequestedAt: number;
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

export type PiEditorActionOpenNew = ReduxAction & {
  editorID: string;
  documentID?: string;
  content?: unknown;
};

export type PiEditorActionLoad = PiEditorAction & {
};

export type PiEditorActionUpdate = PiEditorAction & {
  editorID: string;
  documentID: string;
  editorState: EditorState;
  blocksChanged: string[];
  entitiesHaveChanged: boolean;
  isPasted: boolean;
  isFocused: boolean;
  autoSave?: boolean;
  saveIntervalMS?: number;
  selHasChanged: boolean;
  selection?: {
    anchor: {
      key: string;
      offset: number;
    };
    focus: {
      key: string;
      offset: number;
    };
    hasFocus: boolean;
  };
};

export type PiEditorActionSave = PiEditorAction & {
  editorID: string;
};

export type PiEditorExtension<P> = {
  handleReturn?: HandleReturnFn<P>;
  handleBeforeInput?: HandleBeforeInputFn<P>;
  handleKeyCommand?: HandleKeyCommandFn<P>;
  handleKeyBinding?: HandleKeyBindingFn<P>;
};

export type HandleReturnFn<P> = (
  event: SyntheticKeyboardEvent,
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps?: P,
) => [boolean, EditorState];

export type HandleBeforeInputFn<P> = (
  chars: string,
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps?: P,
) => [DraftHandleValue|undefined, EditorState];

export type HandleKeyCommandFn<P> = (
  command: string,
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps?: P,
) => [DraftHandleValue|undefined, EditorState]

export type HandleKeyBindingFn<P> = (
  e: SyntheticKeyboardEvent,
  eState: EditorState,
  extProps?: P,
) => [boolean, string | null, EditorState]

export type BlockRendererFn<P, T extends PiComponentProps> = (
  block: ContentBlock,
  editorName: string,
  extProps: P,
  editorProps: {
    documentID: string;
    readOnly: boolean;
    autoSave: boolean;
    saveIntervalMS?: number;
    stateSavedAt?: number;
    withSpellCheck: boolean; // true,
    plugins: any[];
    extensions: {[key: string]: unknown};
  },
  isFocused: boolean,
) => BlockRenderDef<T> | null;

/**
 * API to implement for a custom block render component defined above
 */
export type BlockRenderComponentProps<P> = {
  contentState: ContentState;
  block: ContentBlock;
  blockProps: P;
  selection: SelectionState;
  // blockStyleFn: ƒ blockStyleFn()
  // customStyleMap: {BOLD: {…}, CODE: {…}, ITALIC: {…}, STRIKETHROUGH: {…}, UNDERLINE: {…}}
  // customStyleFn: undefined
  // decorator: {getDecorations: ƒ, getComponentForKey: ƒ, getPropsForKey: ƒ}
  // direction: "LTR"
  // forceSelection: false
  // offsetKey: "4f9lk-0-0"
};
export type BlockRenderComponent<P> = React.FC<BlockRenderComponentProps<P>>;

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

export function getEditorRedux<S extends ReduxState>(
  editorID: string,
  state: S,
): PiEditorRxState {
  // SOrry for the type gymnastics
  const as = (state as unknown) as {[key: string]: {[key: string]: unknown}};
  const p = as.pihanga[editorID] as {[key: string]: unknown};
  const rs = { ...as[editorID], ...p } as PiEditorRxState;
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
    // setTimeout(() => {
    //   reportEditorStateUpdate(editorState, rs.editorState, editorID, rs.documentID);
    // }, 0);
    return update(state, ['pihanga', editorID], { editorState }) as S;
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

export function registerExtensions<P>(
  name: string,
  extensions: PiEditorExtension<P>,
  priority = 500,
): void {
  if (extensions.handleReturn) {
    const re = HandleReturnExtensions;
    re.push({ name, priority, f: extensions.handleReturn });
    re.sort((a, b) => b.priority - a.priority);
  }
  if (extensions.handleBeforeInput) {
    const ha = HandleBeforeInputExtensions;
    ha.push({ name, priority, f: extensions.handleBeforeInput });
    ha.sort((a, b) => b.priority - a.priority);
  }
  if (extensions.handleKeyCommand) {
    const ha = HandleKeyCommandExtensions;
    ha.push({ name, priority, f: extensions.handleKeyCommand });
    ha.sort((a, b) => b.priority - a.priority);
  }
  if (extensions.handleKeyBinding) {
    const ha = KeyBindingFnExtensions;
    ha.push({ name, priority, f: extensions.handleKeyBinding });
    ha.sort((a, b) => b.priority - a.priority);
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
