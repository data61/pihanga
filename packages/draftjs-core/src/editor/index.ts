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
  PiEditorFocusAction, DocumentRxState
} from './api';

export * from './api';
export { addDecorator } from './decorator';

const Domain = 'EDITOR';
export const ACTION_TYPES = registerActions(Domain, [
  'OPEN', 'OPEN_NEW', 'LOAD', 'FETCH_REQUEST', 'OPENED', 'REQUEST_SAVE', 'SAVED', 'UPDATE', 'REQUEST_FOCUS', 'ERROR']);

type RxStateWithDocument = ReduxState & { documents: {[key: string]: unknown }};

export function init(register: PiRegister): void {
  register.cardComponent({
    name: 'Editor',
    component: EditorComponent,
    events: {
      onUpdate: ACTION_TYPES.UPDATE,
    },
    defaults: {
      focusRequestedAt: 0,
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
    const { editorID, content, title } = a;
    const documentID = a.documentID || uuidv4();
    const doc = { content, title };
    const [esh, updateAction] = createState(editorID, documentID, doc);
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
    const doc = (state as RxStateWithDocument).documents[documentID] as DocumentRxState;
    if (doc) {
      const [esh, updateAction] = createState(editorID, documentID, doc);
      dispatchFromReducer({
        type: ACTION_TYPES.OPENED,
        editorID,
        documentID,
        content: doc.content,
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
    const docs = (state as {documents?: {[id: string]: {content: unknown}}}).documents;
    const prevContent = docs ? docs[documentID]?.content : null;
    const content = persistState(ers.editorState);
    const props = { stateSaveRequestedAt: -1, stateSavedAt: Date.now() };
    const s1 = update(state, ['pihanga', editorID], props);
    dispatchFromReducer({
      type: ACTION_TYPES.SAVED,
      documentID,
      editorID,
      content,
      prevContent,
    });
    return update(s1, ['documents', documentID], { content });
  });

  register.reducer(ACTION_TYPES.REQUEST_FOCUS, (state: ReduxState, { editorID }: PiEditorFocusAction) => {
    // put request a bit into the future to allow for settling of other actions
    return update(state, ['pihanga', editorID], { focusRequestedAt: Date.now() + 100 });
  });
}

function createState(
  editorID: string,
  documentID: string,
  document?: DocumentRxState,
): [PiEditorRxState, PiEditorActionUpdate] {
  const cd = Decorator({ editorID });
  let cs; let catalogKey; let blocksChanged: string[];
  if (document) {
    [cs, catalogKey, blocksChanged] = createContentState(document.content);
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
  } as PiEditorRxState;
  if (document && document.content && document.content.lastSaved) {
    rxState.stateSavedAt = document.content.lastSaved;
  }
  return [rxState, updateAction];
}
