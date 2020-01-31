import { registerActions, dispatch, ReduxAction, PiRegister } from '@pihanga/core';
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
const ACTION_TYPES = registerActions(Domain, ['SELECTED', 'VALUE', 'CLICKED', 'EDIT',  'UPDATE', 'CLOSE']);

export const StyleName = 'LINK';

// type LinkDialogState = {
//   url: string,
//   originalUrl: string,
//   entityKey: string,
//   blockKey: string, // block link is located in
//   selection?: any, // TODO: should map out
// };

type UrlLinkState = LinkState & {
  url: string,
  originalUrl: string,
};

type LinkEntityState = {
  url: string,
};

export type LinkValueAction = ReduxAction & {
  editorID: string,
  url: string,
};

export const PLUGIN_TYPE = 'LinkDialog';

export const init = (register: PiRegister) => {
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
  });
  BackendInit(register);

  const opts:ReducerOpts<UrlLinkState> = {
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
      const url = a.url;
      if (url && a.url !== '') {
        return {url};
      } else {
        return undefined;
      }
    },
    selectGuard: (a, lds) => lds.originalUrl === a.url,
    extendState: (a, linkEntity) => {
      let url = '';
      if (a.url) {
        url = a.url;
      } else if (linkEntity) {
        url = (linkEntity.getData() as LinkEntityState).url
      }
      return {url};
    },
    stateFromEntity: (a, cs) => {
      const url = a.entityKey ? cs.getEntity(a.entityKey).getData().url : null;
      return {
        url,
        originalUrl: url,
      }
    },

    showPopperName: 'link',
    editPopperName: 'link.edit',
  }

  initReducers(register, opts); 
}

const decorator:DecorationMapper = (_1, attr, classes, _2, ek, editorOpts, {blockKey, start, end})  => {
  const id = `link-${blockKey}-${start}-${end}`;
  attr.element = 'a';
  attr.onClick = (e:any) => {
    e.preventDefault();
    //e.stopPropagation();
    dispatch({
      id: editorOpts.editorID,
      type: ACTION_TYPES.CLICKED,
      entityKey: ek,
      blockKey, // needed to remove link 
      elementID: id,
      editorID: editorOpts.editorID,
    });
  }
  attr.props['data-link-id'] = id;
  attr.props['data-entity-key'] = ek;
  attr.props['data-block-key'] = blockKey;
  // while we would know the url at this point, when we change it in
  // the respective entity, we not necessarily refresh the decorated element.
  attr.props['href'] = '#';
  attr.props['target'] = '_none';
  attr.props['rel'] = 'noreferrer';

  attr.className.push(classes['LINK.link']);
  // make link draggable
  attr.className.push(classes['LINK.link.draggable']);
  attr.useDrag = {
    item: { type: DragItemTypes.LINK },
    collect: monitor => {
      return monitor.isDragging() ? 'LINK.link.dragging' : undefined;
		},
  };
}
