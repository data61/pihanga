import { 
  registerActions, 
  update, 
  dispatch, 
  dispatchFromReducer, 
  getCardState, 
  ReduxState,
  ReduxAction,
  PiRegister
} from  '@pihanga/core';
import { 
  EditorState, 
  ContentBlock,
  DraftHandleValue,
  ContentState,
  EditorChangeType,
  SelectionState,
} from  'draft-js';

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
export type DecoratorDeclaration = DD;
export type DecorationMapper = DM;
export type DecoratorClassDef = DC;

export { default as handleReturn } from './handleReturn';

// defined in @types/draft-js, but apparently not exported
export type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;

const Domain = 'EDITOR';
export const ACTION_TYPES = registerActions(Domain, ['OPEN', 'LOAD', 'FETCH_REQUEST', 'OPENED', 'REQUEST_SAVE', 'SAVED', 'UPDATE']);

const DEF_SAVE_INTERVAL_MS = 3000;

export type EditorRedux = {
  editorState?: any,
  documentID?: string,
  autoSave?: boolean,
  catalogKey?: string,
  stateSaved?: boolean,
  stateLastSaved?: number,
  saveIntervalMS?: number, // msec to wait before persisting current editor state
  plugins?: any,
}

type EditorAction = ReduxAction & {
  id: string, // editor name
  editorID: string,
  documentID: string, // assumed to be under 'documents' 
};

type EditorAction2 = {
  id?: string, // editor name
  editorID: string,
  documentID: string, // assumed to be under 'documents' 
};

export type EditorSelection = {
  anchorKey: string,
  anchorOffset: number, 
  focusKey?: string,
  focusOffset: number,
};

export type EditorActionOpen = EditorAction & {
};

export type EditorActionLoad = EditorAction & {
};

export type EditorActionUpdate = EditorAction & {
  editorState: EditorState,
  blocksChanged: string[],
};

export type EditorActionSave = EditorAction & {
  editorID: string,
};

export type EditorExtension = {
  handleReturn?: HandleReturnFn,
  handleBeforeInput?: HandleBeforeInputFn,
  handleKeyCommand?: HandleKeyCommandFn,
};
export type HandleReturnFn = (
  event: SyntheticKeyboardEvent, 
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps: any
) => [boolean, EditorState];
export type HandleBeforeInputFn = (
  chars: string, 
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps: any
) => [DraftHandleValue|undefined, EditorState];
export type HandleKeyCommandFn = (
  command: string, 
  eState: EditorState,
  readOnly: boolean, // default read only
  extProps: any
) => [DraftHandleValue|undefined, EditorState]

export type BlockRendererFn = (
  block: ContentBlock,
  editorID: string,
  documentID: string,
  readOnly: boolean, // editor's default setting
  extProps: any,
) => BlockRenderDef | null;

export type BlockRenderDef = {
  component: React.FunctionComponent<any>, // BlockRenderOpts
  editable: boolean,
  props: {[key:string]:any},
};

export type BlockRenderOpts = {[key:string]:any}; // TODO: May want to flesh out 'any'

export type BlockRendererFnMap = {[key:string]:BlockRendererFn};

export const getEditorRedux = (editorID: string, state: any): EditorRedux => {
  const rs = state[editorID] as EditorRedux;
  return rs;
}

export const getEditorStateFromRedux = (editorID: string, state: any): EditorState => {
  return getEditorRedux(editorID, state).editorState;
}

export const getDocumentIDFromRedux = (editorID: string, state: any): string => {
  return getEditorRedux(editorID, state).documentID || '';
}

export const updateEditorStateInRedux = (editorState: EditorState, editorID: string, state: ReduxState): ReduxState => {
  const rs = state[editorID] as EditorRedux;
  if (editorState === rs.editorState) {
    return state;
  } else {
    setTimeout(() => {
      reportEditorStateUpdate(editorState, rs.editorState, editorID, rs.documentID);
    }, 0);
    return update(state, [editorID], {editorState});
  }
}

export const reportEditorStateUpdate = (
  editorState: EditorState, 
  oldEditorState: EditorState, 
  editorID: string,
  documentID: string = '???',
  catalogKey?: string,
) => {
  const cs = editorState.getCurrentContent();
  const bm = cs.getBlockMap();
  let changed = false;
  const blocksChanged = [] as string[];
  const origCS = oldEditorState.getCurrentContent();
  const origBM = origCS.getBlockMap();
  const bm2 = bm.map(b => {
    const bk = b!.getKey();
    if (b !== origBM.get(bk)) {
      blocksChanged.push(bk);
      changed = true;
    }
    const d = b!.getData();
    if (d.get('CATALOG_KEY')) {
      return b;
    } else {
      if (!catalogKey) {
        // could potentially get with getCatalogKey()
        console.warn(`Reporting editor state without CATALOG_KEY`);
      } else {
        const d2 = d.set('CATALOG_KEY', catalogKey);
        changed = true;
        return b!.merge({data: d2});
      }
    }
  });
  let es2 = editorState;
  if (changed) {
    const cs2 = cs.merge({blockMap: bm2}) as ContentState;
    es2 = EditorState.push(editorState, cs2, 'change-block-data');
  }
  
  const entitiesHaveChanged = getCatalog(cs) !== getCatalog(origCS)
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

export const setActivePopper = (state: ReduxState, editorID: string, popper: string|undefined) => {
  return update(state, ['pihanga', editorID], {activePopper: popper}); 
}

export const cardNameForPluginType = (pluginType: string, editorID: string, state: ReduxState) => {
  const plugins = getCardState(editorID, state).plugins as {[key:string]:string}[];
  const p = plugins.find(p => p.type === pluginType);
  return p ? p.cardName : undefined;
}

export const init = (register: PiRegister) => {
  register.cardComponent({
    name: 'Editor', 
    component: EditorComponent, 
    events: {
      // onLoad: ACTION_TYPES.LOAD,
      // onSave: ACTION_TYPES.REQUEST_SAVE,
      onUpdate: ACTION_TYPES.UPDATE,
    },
  });

  register.reducer(ACTION_TYPES.OPEN, (state: ReduxState, a: EditorActionOpen) => {
    const editorID = a.id || a.editorID;
    const es = state[editorID];
    if (es.documentID === a.documentID) {
      return state; // already showing
    }
    dispatchFromReducer<EditorAction2>(ACTION_TYPES.LOAD, {
      editorID: a.editorID, 
      documentID: a.documentID,
    });
    return update(state, [editorID], {documentID: a.documentID});
  });
  
  register.reducer(ACTION_TYPES.LOAD, (state: ReduxState, a: EditorActionLoad) => {
    const editorID = a.id || a.editorID;
    const documentID = a.documentID;
    const doc = state.documents[documentID];
    if (doc) {
      const [esh, updateAction] = createState(editorID, documentID, doc.content);
      dispatchFromReducer({
        type: ACTION_TYPES.OPENED, 
        editorID, 
        documentID,
      });
      dispatchFromReducer(updateAction);
      return update(state, [editorID], esh);
    } else {
      dispatchFromReducer({
        type: ACTION_TYPES.FETCH_REQUEST, 
        editorID, 
        documentID,
      });
      return state;
    }
  });
 
  register.reducer(ACTION_TYPES.UPDATE, (state: ReduxState, a: EditorActionUpdate) => {
    //   id: 'editor',
    //   documentID: 'page2',
    //   editorState: ...
    const props:EditorRedux = {editorState: a.editorState, stateSaved: false};
    const ers = (state[a.id] || state[a.editorID]) as EditorRedux;
    if (!ers.stateSaved && !!ers.autoSave) {
      // first time saved content is changing
      const wait = ers.saveIntervalMS || DEF_SAVE_INTERVAL_MS;
      const editorID = a.id;
      const documentID = a.documentID;
      setTimeout(() => {
        dispatch({type: ACTION_TYPES.REQUEST_SAVE, editorID, documentID});
      }, wait);
    }
    return update(state, [a.id], props);
  });

  register.reducer(ACTION_TYPES.REQUEST_SAVE, (state: ReduxState, {documentID, editorID}) => {
    const ers = state[editorID] as EditorRedux;
    if (documentID !== ers.documentID) {
      return state; // no longer valid
    }
    const ps = persistState(ers.editorState);
    const s1 = update(state, [editorID], {stateSaved: true});
    dispatchFromReducer({
      type: ACTION_TYPES.SAVED,
      documentID,
      editorID,
    });
    return update(s1, ['documents', documentID], {content: ps});
  });
}

const createState = (editorID: string, documentID: string, content: any): [EditorRedux, EditorActionUpdate] => {
  const cd = Decorator({editorID});
  let cs, catalogKey, blocksChanged: string[];
  //  const content = document.content as any;
  if (content) {
    [cs, catalogKey, blocksChanged] = createContentState(content);
  } else {
    cs = EditorState.createEmpty().getCurrentContent();
    [catalogKey, cs] = initializeCatalog(cs);
    blocksChanged = [];
  }
  const editorState = EditorState.createWithContent(cs, cd);
  const updateAction = {
    type: ACTION_TYPES.UPDATE,
    id: editorID,
    editorID,
    documentID, 
    editorState, 
    blocksChanged,
    entitiesHaveChanged: true,
  } as EditorActionUpdate;
  return [{editorState, documentID, catalogKey, stateSaved: true}, updateAction];
}

export const registerDecorator = (name: string, declaration: DecoratorDeclaration) => {
  const dh = DECORATORS as {[key:string]:DecoratorDeclaration};
  if (dh[name]) {
    console.warn(`Duplicate decorator defintion '${name}'`);
  }
  dh[name] = declaration as any;
}

export const registerBlockRenderer = (type: string, renderFn: BlockRendererFn) => {
  const bt2r = BlockType2Renderer as BlockRendererFnMap;
  if (bt2r[type]) {
    console.warn(`Duplicate block renderer defintion '${type}'`);
  }
  bt2r[type] = renderFn;
}

export const registerExtensions = (name: string, extensions: EditorExtension) => {
  if (extensions.handleReturn) {
    const re = HandleReturnExtensions;
    re.unshift({name, f: extensions.handleReturn});
  }
  if (extensions.handleBeforeInput) {
    const ha = HandleBeforeInputExtensions;
    ha.unshift({name, f: extensions.handleBeforeInput});
  }
  if (extensions.handleKeyCommand) {
    const ha = HandleKeyCommandExtensions;
    ha.unshift({name, f: extensions.handleKeyCommand});
  }
}

export const removeSelection = (
  eState: EditorState, 
  contentState: ContentState, 
  changeType: EditorChangeType, 
  selection: SelectionState): EditorState => 
{
  const eState2 = EditorState.push(eState, contentState, changeType);
  const sel = selection.merge({
    anchorKey: selection.getFocusKey(), anchorOffset: selection.getFocusOffset(),
  }) as SelectionState;
  return EditorState.forceSelection(eState2, sel);
}
