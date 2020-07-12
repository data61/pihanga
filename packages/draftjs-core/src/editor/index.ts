import {
  registerActions,
  update,
  dispatch,
  dispatchFromReducer,
  ReduxState,
  PiRegister,
} from '@pihanga/core';
import {
  EditorState,
} from 'draft-js';
import { v4 as uuidv4 } from 'uuid';

import {
  EditorComponent,
  DEF_SAVE_INTERVAL_MS,
} from './editor.component';
import Decorator from './decorator';
import { createContentState, persistState } from './persist';
import { initializeCatalog } from '../util';
import {
  PiEditorRxState,
  PiEditorActionOpen,
  PiEditorActionLoad,
  PiEditorActionUpdate,
  getEditorRedux,
  getDocumentIDFromRedux,
  PiEditorActionSave,
  PiEditorActionOpenNew,
} from './api';

export * from './api';
export { addDecorator } from './decorator';

const Domain = 'EDITOR';
export const ACTION_TYPES = registerActions(Domain, ['OPEN', 'OPEN_NEW', 'LOAD', 'FETCH_REQUEST', 'OPENED', 'REQUEST_SAVE', 'SAVED', 'UPDATE', 'ERROR']);

type RxStateWithDocument = ReduxState & { documents: {[key: string]: unknown }};

export function init(register: PiRegister): void {
  register.cardComponent({
    name: 'Editor',
    component: EditorComponent,
    events: {
      // onLoad: ACTION_TYPES.LOAD,
      // onSave: ACTION_TYPES.REQUEST_SAVE,
      onUpdate: ACTION_TYPES.UPDATE,
    },
  });

  register.reducer(ACTION_TYPES.OPEN, (state: ReduxState, a: PiEditorActionOpen) => {
    const { editorID } = a;
    const docId = getDocumentIDFromRedux(editorID, state);
    if (docId === a.documentID) {
      return state; // already showing
    }
    dispatchFromReducer<PiEditorActionLoad>(ACTION_TYPES.LOAD, {
      type: ACTION_TYPES.LOAD, // TODO: Fix type so we no longer need that
      editorID: a.editorID,
      documentID: a.documentID,
    });
    return update(state, ['pihanga', editorID], { documentID: a.documentID });
  });

  register.reducer(ACTION_TYPES.OPEN_NEW, (state: ReduxState, a: PiEditorActionOpenNew) => {
    const { editorID, content } = a;
    const documentID = a.documentID || uuidv4();
    const [esh, updateAction] = createState(editorID, documentID, content);
    dispatchFromReducer({
      type: ACTION_TYPES.OPENED,
      editorID,
      documentID,
      isNew: true,
    });
    dispatchFromReducer(updateAction);
    return update(state, ['pihanga', editorID], esh);
  });

  register.reducer(ACTION_TYPES.LOAD, (state: ReduxState, a: PiEditorActionLoad) => {
    const { editorID, documentID } = a;
    const doc = (state as RxStateWithDocument).documents[documentID] as {content: unknown};
    if (doc) {
      const [esh, updateAction] = createState(editorID, documentID, doc.content);
      dispatchFromReducer({
        type: ACTION_TYPES.OPENED,
        editorID,
        documentID,
        isNew: false,
      });
      dispatchFromReducer(updateAction);
      return update(state, ['pihanga', editorID], esh);
    } else {
      dispatchFromReducer({
        type: ACTION_TYPES.FETCH_REQUEST,
        editorID,
        documentID,
      });
      return state;
    }
  });

  register.reducer(ACTION_TYPES.UPDATE, (state: ReduxState, a: PiEditorActionUpdate) => {
    const props = { editorState: a.editorState } as {[k: string]: unknown};
    const { editorID, blocksChanged, autoSave } = a;
    if (autoSave && blocksChanged.length > 0) {
      const ers = getEditorRedux(editorID, state);
      if (ers.stateSaveRequestedAt < 0) {
        // first time saved content is changing
        const wait = a.saveIntervalMS || DEF_SAVE_INTERVAL_MS;
        const { documentID } = a;
        setTimeout(() => {
          dispatch({ type: ACTION_TYPES.REQUEST_SAVE, editorID, documentID });
        }, wait);
        props.stateSaveRequestedAt = Date.now();
      }
    }
    return update(state, ['pihanga', editorID], props);
  });

  register.reducer(ACTION_TYPES.REQUEST_SAVE, (state: ReduxState, a: PiEditorActionSave) => {
    const { documentID, editorID } = a;
    const ers = (state.pihanga || {})[editorID] as PiEditorRxState;
    if (!ers) {
      dispatchFromReducer({
        type: ACTION_TYPES.ERROR,
        msg: 'Cannot find editor state in pihanga',
        documentID,
        editorID,
      });
      return state;
    }
    if (documentID !== ers.documentID || !ers.editorState) {
      return state; // no longer valid
    }
    const content = persistState(ers.editorState);
    const props = { stateSaveRequestedAt: -1, stateSavedAt: Date.now() };
    const s1 = update(state, ['pihanga', editorID], props);
    dispatchFromReducer({
      type: ACTION_TYPES.SAVED,
      documentID,
      editorID,
      content,
    });
    return update(s1, ['documents', documentID], { content });
  });
}

function createState(
  editorID: string,
  documentID: string,
  content?: unknown,
): [PiEditorRxState, PiEditorActionUpdate] {
  const cd = Decorator({ editorID });
  let cs; let catalogKey; let blocksChanged: string[];
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
    isPasted: false,
  } as PiEditorActionUpdate;
  const rxState = {
    editorState,
    editorID,
    documentID,
    catalogKey,
    stateSaveRequestedAt: -1,
  };
  return [rxState, updateAction];
}
