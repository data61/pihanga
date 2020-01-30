import {
  RichUtils,
  getDefaultKeyBinding, 
  DraftHandleValue,
  EditorState,
  // KeyBindingUtil,
} from 'draft-js';
import { SyntheticKeyboardEvent } from '../editor';

// const TAB_COMMAND = 'tab';
// const SHIFT_TAB_COMMAND = 'shift-tab';


const MAX_LIST_DEPTH = 4;

export function keyBindingFn(e: SyntheticKeyboardEvent, eState: EditorState, onChange: (es: EditorState) => void) {
  // const {hasCommandModifier} = KeyBindingUtil;

  // if (e.keyCode === 9) {
  //   return  e.shiftKey ? SHIFT_TAB_COMMAND : TAB_COMMAND;
  // }

  switch (e.keyCode) {
    case 9: // TAB
      const es = RichUtils.onTab(e, eState, MAX_LIST_DEPTH);
      onChange(es);
      return;
    default:
      return getDefaultKeyBinding(e);
  }

  // if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
  //   return 'myeditor-save';
  // }
  
}

export function handleKeyCommand(command: string, eState: EditorState): [DraftHandleValue|undefined, EditorState] {
  // if (command === TAB_COMMAND) {
  //   console.log(">>>TAB");
  // } else {
  //   console.log("Key command:", command);
  // }
  const es = RichUtils.handleKeyCommand(eState, command);
  return [es ? 'handled' : undefined, es? es : eState];
}