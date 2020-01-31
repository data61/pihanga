import { update, PiRegister } from  '@pihanga/core';
import { Map } from 'immutable';
import { 
  EditorState, 
  SelectionState, 
  CharacterMetadata, 
  genKey, 
  ContentBlock,
  ContentState, 
  DraftEntityMutability ,
  EntityInstance,
} from 'draft-js';
import { addNamedEntity, entitiesForSelection, removeNamedEntity, } from '@pihanga/draftjs-core';
import { 
  removeSelection, 
  setActivePopper, 
  getEditorStateFromRedux,
  updateEditorStateInRedux,
} from '@pihanga/draftjs-core';
import { updatePluginState } from '../index';

type ActionTypes = {
  VALUE: string,
  SELECTED: string,
  CLOSE: string,
  CLICKED: string,
  EDIT: string,
  STYLE_UPDATE: string,
}

export type ReducerOpts<S extends LinkState> = {
  pluginType: string,
  styleName: string,
  styleType: string,

  actionTypes: ActionTypes,

  getLinkState: (action: any, state?: S) => {[key:string]:any} | undefined,
  selectGuard: (action: any, state: S) => boolean, // return true if 'SELECT" action sshould be ignored
  extendState: (action: any, linkEntity?: EntityInstance) => {[key:string]:any},
  stateFromEntity: (action: any, cs: ContentState) => {[key:string]:any},

  showPopperName: string,
  editPopperName: string,
};


export type LinkState = {
  entityKey: string,
  blockKey: string,
  selection: SelectionState;

};

export function initReducers<S extends LinkState>(register: PiRegister, opts: ReducerOpts<S>) {
  register.reducer(opts.actionTypes.VALUE, (state, a) => {
    // editorID: 'editor',
    // url: 'ssssasasasa'
    const data = opts.extendState(a);
    return updatePluginState(a.editorID, opts.pluginType, state, path => {
      //return update(state, path, {url: a.url});
      return update(state, path, data);
    });
  });

  register.reducer(opts.actionTypes.SELECTED, (state, a) => {
    // editorID: 'editor',
    return updatePluginState<S>(a.editorID, opts.pluginType, state, (_, lds) => {
      if (opts.selectGuard(a, lds)) {
        return state;
      }
      const eState = getEditorStateFromRedux(a.editorID, state);
      let editorState = eState;
      const data = opts.getLinkState(a, lds);
      if (lds.entityKey) {
        editorState = updateLinkState(data, lds, eState)
      } else {
        // new link for selection
        const name = `${opts.styleName}:${genKey()}`;
        const selection = lds.selection as SelectionState;
        const cs = eState.getCurrentContent();
        const cs2 = addNamedEntity(cs, selection, name, () => [opts.styleName, 'MUTABLE', data || {}]);
        editorState = removeSelection(eState, cs2, 'change-inline-style', selection);
      }
      return updateEditorStateInRedux(editorState, a.editorID, state);
    });
  });

  register.reducer(opts.actionTypes.CLOSE, (state, a) => {
    // editorID: 'editor',
    return updatePluginState<S>(a.editorID, opts.pluginType, state, (path, lds) => {
      let s2 = state;
      if (lds.selection) {
        const selection = lds.selection;
        //console.log("REMOVE SELECTION", selection);
        let eState = getEditorStateFromRedux(a.editorID, state);
        let cs = eState.getCurrentContent();
        cs = removeNamedEntity(cs, selection, 'SELECT');
        eState = EditorState.push(eState, cs, 'change-inline-style');
        //eState = EditorState.forceSelection(eState, selection); // need that for firefox, chrome still not working
        s2 = updateEditorStateInRedux(eState, a.editorID, state);
      }
      const s3 = setActivePopper(s2, a.editorID, undefined);
      return update(s3, path, null);
    });
  });

  // link is clicked directly
  register.reducer(opts.actionTypes.CLICKED, (state, a) => {
    // url: 'http://foox',
    // elementID: 'link-81096',
    // editorID: 'editor'
    // entityKey: '2',
    return updatePluginState(a.editorID, opts.pluginType, state, path => {
      const cs = getEditorStateFromRedux(a.editorID, state).getCurrentContent();
      const s2 = setActivePopper(state, a.editorID, opts.showPopperName);
      const eh = opts.stateFromEntity(a, cs);
      // const url = a.entityKey ? cs.getEntity(a.entityKey).getData().url : null;
      return update(s2, path, {
        // url,
        // originalUrl: url,
        ...eh,
        domElementID: a.elementID,
        entityKey: a.entityKey,
        blockKey: a.blockKey,
      }); 
    })
  });

  // <a> is clicked directly
  register.reducer(opts.actionTypes.EDIT, (state, a) => {
    return setActivePopper(state, a.editorID, opts.editPopperName);
  });

  // watch for the icon clicked in style menu
  register.reducer(opts.actionTypes.STYLE_UPDATE, (state, a) => {
    // editorID: 'editor'
    // action: 'LINK'
    // actionType: 'link'
    // selection: ...
    if (a.actionType !== opts.styleType) {
      return state;
    }
    return updatePluginState<S>(a.editorID, opts.pluginType, state, path => {
      let eState = getEditorStateFromRedux(a.editorID, state);
      let cs = eState.getCurrentContent();
      const selection = SelectionState.createEmpty(a.selection.anchorKey).merge(a.selection) as SelectionState;
      
      cs = addNamedEntity(cs, selection, 'SELECT', () => ['SELECT', 'MUTABLE' as DraftEntityMutability]);
      eState = EditorState.push(eState, cs, 'change-inline-style');
      eState = EditorState.forceSelection(eState, selection); // need that for firefox, chrome still not working
      const s2 = updateEditorStateInRedux(eState, a.editorID, state);

      const linkEntity = entitiesForSelection(cs, selection).filter(e => {
        return e.getType() === opts.styleName;
      })[0];
      // {url: ...}
      // const url = linkEntity ? (linkEntity.getData() as LinkEntityState).url : '';
      const eh = opts.extendState(a, linkEntity);
      const s3 = setActivePopper(s2, a.editorID, opts.editPopperName);
      return update(s3, path, {
        // url: url,
        // originalUrl: url,
        ...eh,
        selection: selection, //a.selection,
        //entityKey: linkKey,
      }); 
    });
  });

  const updateLinkState = (data: {[key:string]:any} | undefined, lds: S, eState: EditorState): EditorState => {
    const cs = eState.getCurrentContent();
    if (data) {
      // update existing link
      const cs2 = cs.replaceEntityData(lds.entityKey, data);
      return EditorState.push(eState, cs2, 'apply-entity');
    } else {
      // remove link ... don't have selection but entire blockKey
      const blockMap = cs.getBlockMap();
      const bk = lds.blockKey;
  
      const bm = Map([[bk, blockMap.get(bk)]]) as Map<string, ContentBlock>;
      const mBlocks = bm.map((block) => {
        if (!block) return null; // should never happen, but the type checker forces me
        let chars = block.getCharacterList();
        const c2 = chars.map(e => CharacterMetadata.removeStyle(e as CharacterMetadata, lds.entityKey));
        return block.set('characterList', c2);
      }) as Map<string, ContentBlock>;
      const cs2 = cs.merge({
        blockMap: blockMap.merge(mBlocks),
      }) as ContentState;
      return EditorState.push(eState, cs2, 'change-inline-style');
    }
  }

}


