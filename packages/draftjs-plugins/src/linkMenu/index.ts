/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  registerActions, dispatch, ReduxAction, PiRegister,
} from '@pihanga/core';
// import { genKey, } from 'draft-js';
import {
  registerDecorator,
  DecorationMapper,
} from '@pihanga/draftjs-core';
import { ACTION_TYPES as STYLE_ACTION_TYPES } from '../styleMenu';
import LinkDialog from './linkDialog.component';
import { DragItemTypes } from '../index';
import BackendInit from './backend';
import style from './decorator.style';
import { ReducerOpts, LinkState, initReducers } from './reducers';

export const Domain = 'EDITOR:LINK';
const ACTION_TYPES = registerActions(Domain, ['SELECTED', 'VALUE', 'CLICKED', 'EDIT', 'UPDATE', 'CLOSE', 'STYLE_UPDATE']);

export const StyleName = 'LINK';

// type LinkDialogState = {
//   url: string,
//   originalUrl: string,
//   entityKey: string,
//   blockKey: string, // block link is located in
//   selection?: any, // TODO: should map out
// };

type UrlLinkState = LinkState & {
  value: string;
  originalValue: string;
};

export type LinkEntityState = {
  url: string;
  title?: string;
  snippet?: string;
  source?: string;
};

export type LinkValueAction = ReduxAction & {
  editorID: string;
  value: string;
};

export type LinkSelectedAction = ReduxAction & {
  editorID: string;
};

export type LinkCloseAction = ReduxAction & {
  editorID: string;
};

export type LinkClickedAction = ReduxAction & {
  editorID: string;
  elementID: string;
  entityKey: string;
  blockKey: string;
};

export type LinkStyleUpdateAction = ReduxAction & {
  editorID: string;
  actionType: string;
  selection: {
    anchorKey: string;
    anchorOffset: number;
  };
};

export const PLUGIN_TYPE = 'LinkDialog';

export const init = (register: PiRegister): void => {
  registerDecorator(StyleName, [decorator, style]);

  register.cardComponent({
    name: PLUGIN_TYPE,
    component: LinkDialog,
    events: {
      onSelected: ACTION_TYPES.SELECTED,
      onEdit: ACTION_TYPES.EDIT,
      onValue: ACTION_TYPES.VALUE,
      onClose: ACTION_TYPES.CLOSE,
    },
    defaults: {
      editorID: (_1:any, _2:any, d:any) => d.editorID,
      isFocused: (_1:any, _2:any, d:any) => d.isFocused,
    },
  });
  BackendInit(register);

  const opts: ReducerOpts<UrlLinkState> = {
    pluginType: PLUGIN_TYPE,
    styleName: StyleName,
    styleType: 'link',

    actionTypes: {
      VALUE: ACTION_TYPES.VALUE,
      SELECTED: ACTION_TYPES.SELECTED,
      CLOSE: ACTION_TYPES.CLOSE,
      CLICKED: ACTION_TYPES.CLICKED,
      EDIT: ACTION_TYPES.EDIT,
      STYLE_UPDATE: STYLE_ACTION_TYPES.UPDATE,
    },

    getLinkState: (a) => {
      const { link } = a;
      if (link && link.url !== '') {
        return { ...link };
      } else {
        return undefined;
      }
    },
    selectGuard: (a, lds) => lds.originalValue === a.value,
    extendState: (a, linkEntity) => {
      const link = a.link || (linkEntity ? linkEntity.getData() : {}) as LinkEntityState;
      const value = a.value || link.url || '';
      return { value, link };
    },
    stateFromEntity: (a, cs) => {
      const link = a.entityKey ? cs.getEntity(a.entityKey).getData() : {};
      return {
        link,
        value: link.url,
        originalValue: link.url,
      };
    },

    showPopperName: 'link',
    editPopperName: 'link.edit',
  };

  initReducers(register, opts);
};

const decorator: DecorationMapper = (_1, attr, classes, _2, ek, editorOpts, { blockKey, start, end }) => {
  const id = `link-${blockKey}-${start}-${end}`;
  attr.element = 'a';
  attr.onClick = (e: any) => {
    e.preventDefault();
    // e.stopPropagation();
    dispatch({
      id: editorOpts.editorID,
      type: ACTION_TYPES.CLICKED,
      entityKey: ek,
      blockKey, // needed to remove link
      elementID: id,
      editorID: editorOpts.editorID,
    });
  };
  attr.props['data-link-id'] = id;
  attr.props['data-entity-key'] = ek;
  attr.props['data-block-key'] = blockKey;
  // while we would know the url at this point, when we change it in
  // the respective entity, we not necessarily refresh the decorated element.
  attr.props.href = '#';
  attr.props.target = '_none';
  attr.props.rel = 'noreferrer';

  attr.className.push(classes['LINK.link']);
  // make link draggable
  attr.className.push(classes['LINK.link.draggable']);
  attr.useDrag = {
    item: { type: DragItemTypes.LINK },
    collect: (monitor) => (monitor.isDragging() ? 'LINK.link.dragging' : undefined),
  };
};
