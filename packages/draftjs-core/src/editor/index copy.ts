// import {
//   registerActions,
//   update,
//   dispatch,
//   dispatchFromReducer,
//   ReduxState,
//   PiRegister,
// } from '@pihanga/core';
// import {
//   EditorState,
// } from 'draft-js';

// import {
//   EditorComponent,
// } from './editor.component';
// import Decorator from './decorator';
// import { createContentState, persistState } from './persist';
// import { initializeCatalog } from '../util';
// import {
//   PiEditorRxState,
//   PiEditorActionOpen,
//   PiEditorActionLoad,
//   PiEditorActionUpdate,
// } from './api';

// export * from './api';

// const Domain = 'EDITOR';
// export const ACTION_TYPES = registerActions(Domain, ['OPEN', 'LOAD', 'FETCH_REQUEST', 'OPENED', 'REQUEST_SAVE', 'SAVED', 'UPDATE']);

// const DEF_SAVE_INTERVAL_MS = 3000;

// export function init(register: PiRegister): void {
//   register.cardComponent({
//     name: 'Editor',
//     component: EditorComponent,
//     events: {
//       // onLoad: ACTION_TYPES.LOAD,
//       // onSave: ACTION_TYPES.REQUEST_SAVE,
//       onUpdate: ACTION_TYPES.UPDATE,
//     },
//   });

//   register.reducer(ACTION_TYPES.OPEN, (state: ReduxState, a: PiEditorActionOpen) => {
//     const editorID = a.id || a.editorID;
//     const es = state[editorID];
//     if (es.documentID === a.documentID) {
//       return state; // already showing
//     }
//     dispatchFromReducer<PiEditorActionLoad>(ACTION_TYPES.LOAD, {
//       type: ACTION_TYPES.LOAD, // TODO: Fix type so we no longer need that
//       editorID: a.editorID,
//       documentID: a.documentID,
//     });
//     return update(state, [editorID], { documentID: a.documentID });
//   });

//   register.reducer(ACTION_TYPES.LOAD, (state: ReduxState, a: PiEditorActionLoad) => {
//     const editorID = a.id || a.editorID;
//     const { documentID } = a;
//     const doc = state.documents[documentID];
//     if (doc) {
//       const [esh, updateAction] = createState(editorID, documentID, doc.content);
//       dispatchFromReducer({
//         type: ACTION_TYPES.OPENED,
//         editorID,
//         documentID,
//       });
//       dispatchFromReducer(updateAction);
//       return update(state, [editorID], esh);
//     } else {
//       dispatchFromReducer({
//         type: ACTION_TYPES.FETCH_REQUEST,
//         editorID,
//         documentID,
//       });
//       return state;
//     }
//   });

//   register.reducer(ACTION_TYPES.UPDATE, (state: ReduxState, a: PiEditorActionUpdate) => {
//     //   id: 'editor',
//     //   documentID: 'page2',
//     //   editorState: ...
//     const props = { editorState: a.editorState, stateSaved: false };
//     const ers = (state[a.id!] || state[a.editorID]) as PiEditorRxState;
//     if (!ers.stateSaved && !!ers.autoSave) {
//       // first time saved content is changing
//       const wait = ers.saveIntervalMS || DEF_SAVE_INTERVAL_MS;
//       const editorID = a.id;
//       const { documentID } = a;
//       setTimeout(() => {
//         dispatch({ type: ACTION_TYPES.REQUEST_SAVE, editorID, documentID });
//       }, wait);
//     }
//     return update(state, [a.id!], props);
//   });

//   register.reducer(ACTION_TYPES.REQUEST_SAVE, (state: ReduxState, { documentID, editorID }) => {
//     const ers = state[editorID] as PiEditorRxState;
//     if (documentID !== ers.documentID || !ers.editorState) {
//       return state; // no longer valid
//     }
//     const ps = persistState(ers.editorState);
//     const s1 = update(state, [editorID], { stateSaved: true });
//     dispatchFromReducer({
//       type: ACTION_TYPES.SAVED,
//       documentID,
//       editorID,
//     });
//     return update(s1, ['documents', documentID], { content: ps });
//   });
// }

// function createState(
//   editorID: string,
//   documentID: string,
//   content: unknown,
// ): [PiEditorRxState, PiEditorActionUpdate] {
//   const cd = Decorator({ editorID });
//   let cs; let catalogKey; let blocksChanged: string[];
//   if (content) {
//     [cs, catalogKey, blocksChanged] = createContentState(content);
//   } else {
//     cs = EditorState.createEmpty().getCurrentContent();
//     [catalogKey, cs] = initializeCatalog(cs);
//     blocksChanged = [];
//   }
//   const editorState = EditorState.createWithContent(cs, cd);
//   const updateAction = {
//     type: ACTION_TYPES.UPDATE,
//     id: editorID,
//     editorID,
//     documentID,
//     editorState,
//     blocksChanged,
//     entitiesHaveChanged: true,
//   } as PiEditorActionUpdate;
//   const rxState = {
//     editorState,
//     editorID,
//     documentID,
//     catalogKey,
//     stateSaved: true,
//   };
//   return [rxState, updateAction];
// }
