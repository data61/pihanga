import {
  cardNameForPluginType,
} from '@pihanga/draftjs-core';
import { PiRegister, ReduxState } from '@pihanga/core';
import { init as linkMenuInit } from './linkMenu';
import { init as styleMenuInit } from './styleMenu';

export const DragItemTypes = {
  LINK: 'link',
};

export function init(register: PiRegister) {
  linkMenuInit(register);
  styleMenuInit(register);
}

export function updatePluginState<T>(
  editorID: string,
  pluginType: string,
  state: ReduxState,
  f: (path:string[], pState: T) => ReduxState
) {
  const pluginName = cardNameForPluginType(pluginType, editorID, state);
  if (pluginName) {
    const lds = state.pihanga[pluginName] as T;
    return f(['pihanga', pluginName], lds);
  } else {
    console.error(`Can't retrieve plugin name from '${editorID}' for plugin type '${pluginType}'`);
    return state;
  }
}
