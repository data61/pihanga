import { registerGET, actions, update, PiRegister } from  '@pihanga/core';

import { Domain, LinkValueAction, PLUGIN_TYPE } from './index';
import { updatePluginState } from '../index';

export type SpacyAnalysis = {
  i: number, // index into word array
  s: number, // span .. number of consecutive words covered by type
  t: string, // type
  f: string, // sentence fragment (computable by word array, index, and span)
};

export const init = (register: PiRegister) => {
  registerGET({
    name: 'queryLink',
    url: '/search?q=":q"',
    trigger: actions(Domain).VALUE,
    request: (action) => {
      const a = action as LinkValueAction;
      return {q: a.url || ''};
    },
    reply: (state, reply, requestAction) => {
      const a = requestAction as LinkValueAction;
      return updatePluginState(a.editorID, PLUGIN_TYPE, state, path => {
        return update(state, path, {search: {
          query: a.url,
          result: reply,
        }});
      });
    },
  });

  // // MOCK
  // register.reducer(actions(Domain).REQUEST_ANALYSIS, (state, action: RequestAnalysisAction) => {
  //   const debug = state.debug.sentences || {};
  //   action.sentences.forEach(s => {
  //     if (debug[s.id] && debug[s.id].spacy) {
  //       const repl = debug[s.id].spacy;
  //       setTimeout(() => {
  //         dispatch({
  //           type: actions(Domain).ANALYSED_SENTENCES,
  //           editorID: action.editorID,
  //           documentID: action.documentID,
  //           blocks: s.blocks,
  //           ...repl,
  //         });
  //       }, 2000);
  //     }
  //   });
    
  //   return state;
  // });
};

export default init;