/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Modifier, SelectionState, DraftEntityMutability } from 'draft-js';
import {
  registerActions,
  PiRegister,
  ReduxAction,
  ReduxState,
} from '@pihanga/core';

import {
  removeSelection,
  setActivePopper,
  getEditorStateFromRedux,
  updateEditorStateInRedux,
  addNamedEntity,
  removeNamedEntity,
} from '@pihanga/draftjs-core';

import { StyleMenu } from './styleMenu.component';
import { MenuIcon, SVG_ICONS } from './menuIcon.component';

import DefSvgIcons from './svgIcons';

export const Domain = 'EDITOR:STYLE_MENU';
export const ACTION_TYPES = registerActions(Domain, ['OPEN', 'CLOSE', 'UPDATE']);

const PLUGIN_TYPE = 'StyleMenu';

type StyleAction = {
  editorID: string;
};

export type StyleOpenAction = StyleAction & {
};

export type StyleCloseAction = StyleAction & {
};

export type Selection = {
  anchorKey: string;
  anchorOffset: number;
}

export type StyleUpdateAction = StyleAction & {
  actionType: string;
  action: string;
  isActive: boolean;
  selection: Selection;
};

export const init = (register: PiRegister): void => {
  Object.entries(DefSvgIcons as {[key: string]: string}).forEach(([n, p]) => addSvgIcon(n, p));

  register.cardComponent({
    name: PLUGIN_TYPE,
    component: StyleMenu,
    events: {
      onOpen: ACTION_TYPES.OPEN,
      onClose: ACTION_TYPES.CLOSE,
    },
    defaults: {
      editorID: (_1: any, _2: any, d: any): string => d.editorID,
      isFocused: (_1: any, _2: any, d: any): boolean => d.isFocused,
    },
  });
  register.cardComponent({
    name: `${PLUGIN_TYPE}.Icon`,
    component: MenuIcon,
    events: {
      onUpdate: ACTION_TYPES.UPDATE,
    },
    defaults: {
      editorID: (_1: any, _2: any, d: any) => d.editorID,
      selection: (_1: any, _2: any, d: any) => d.selection,
      styles: (_1: any, _2: any, d: any) => d.styles,
      blockType: (_1: any, _2: any, d: any) => d.blockType,
    },
  });
  register.reducer(ACTION_TYPES.UPDATE, reduceUpdate);
  register.reducer(ACTION_TYPES.OPEN, (state, a: StyleOpenAction & ReduxAction) => {
    return setActivePopper(state, a.editorID, 'style');
  });
  register.reducer(ACTION_TYPES.CLOSE, (state, a: StyleOpenAction & ReduxAction) => {
    return setActivePopper(state, a.editorID, undefined);
  });
};

const reduceUpdate = (state: ReduxState, a: StyleUpdateAction & ReduxAction): ReduxState => {
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
    const t = a.isActive ? 'paragraph' : block;
    const cs = Modifier.setBlockType(eState.getCurrentContent(), selection, t);
    editorState = removeSelection(eState, cs, 'change-block-type', selection);
  } else {
    return state;
  }
  return updateEditorStateInRedux(editorState, a.editorID, state);
};

export const addSvgIcon = (name: string, path: string): void => {
  const sih = SVG_ICONS as {[key: string]: string};
  if (sih[name]) {
    console.warn(`Duplicate SVG icon declaration '${name}'`);
  }
  sih[name] = path;
};
