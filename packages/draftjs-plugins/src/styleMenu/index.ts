import { Modifier, SelectionState} from 'draft-js';
import { registerActions, PiRegister } from '@pihanga/core';
import { DraftEntityMutability } from 'draft-js';

import { 
  removeSelection, 
  setActivePopper, 
  getEditorStateFromRedux, 
  updateEditorStateInRedux,
} from '@pihanga/draftjs-core';
import { addNamedEntity, removeNamedEntity, } from '@pihanga/draftjs-core';

import { StyleMenu } from './styleMenu.component';
import { MenuIcon, SVG_ICONS } from './menuIcon.component';

import DefSvgIcons from './svgIcons';

export const Domain = 'EDITOR:STYLE_MENU';
export const ACTION_TYPES = registerActions(Domain, ['OPEN', 'CLOSE', 'UPDATE']);

const PLUGIN_TYPE = 'StyleMenu';

export const init = (register: PiRegister) => {
  Object.entries(DefSvgIcons as {[key:string]:string}).forEach(([n,p]) => addSvgIcon(n,p));

  register.cardComponent({
    name: PLUGIN_TYPE, 
    component: StyleMenu,
    events: {
      onOpen: ACTION_TYPES.OPEN,
      onClose: ACTION_TYPES.CLOSE,
    },  
    defaults: {
      editorID: (_1:any, _2:any, d:any) => d.editorID,
      isFocused: (_1:any, _2:any, d:any) => d.isFocused,
    },
  });
  register.cardComponent({
    name: `${PLUGIN_TYPE}.Icon`, 
    component: MenuIcon,
    events: {
      onUpdate: ACTION_TYPES.UPDATE,
    },
    defaults: {
      editorID: (_1:any, _2:any, d:any) => d.editorID,
      selection: (_1:any, _2:any, d:any) => d.selection,
      styles: (_1:any, _2:any, d:any) => d.styles,
      blockType: (_1:any, _2:any, d:any) => d.blockType,
    },
  });
  register.reducer(ACTION_TYPES.UPDATE, reduceUpdate);
  register.reducer(ACTION_TYPES.OPEN, (state, a) => {
    return setActivePopper(state, a.editorID, 'style');
  });
  register.reducer(ACTION_TYPES.CLOSE, (state, a) => {
    return setActivePopper(state, a.editorID, undefined);
  });
}

const reduceUpdate = (state: any, a: any) => {
  const isStyle = a.actionType === 'style';
  const isBlock = a.actionType === 'block';
  if (!(isStyle || isBlock)) {
    return state;
  }

  const eState = getEditorStateFromRedux(a.editorID, state);
  const selection = SelectionState.createEmpty(a.selection.anchorKey).merge(a.selection) as SelectionState;
  let editorState;
  if (isStyle) {
    let cs = eState.getCurrentContent();
    const style = a.action as string;
    if (a.isActive) {
      cs = removeNamedEntity(cs, selection, style);
    } else {
      cs = addNamedEntity(cs, selection, style, () => [style, 'MUTABLE' as DraftEntityMutability]);
    }
    editorState = removeSelection(eState, cs, 'change-inline-style', selection);
  } else if (isBlock) {
    const block = a.action;
    const t = a.isActive ? 'paragraph': block;
    const cs =  Modifier.setBlockType(eState.getCurrentContent(), selection, t);
    editorState = removeSelection(eState, cs, 'change-block-type', selection);
  } else {
    return state;
  }
  return updateEditorStateInRedux(editorState, a.editorID, state);
}

export const addSvgIcon = (name: string, path: string) => {
  const sih = SVG_ICONS as {[key:string]:string};
  if (sih[name]) {
    console.warn(`Duplicate SVG icon declaration '${name}'`);
  }
  sih[name] = path;
}
