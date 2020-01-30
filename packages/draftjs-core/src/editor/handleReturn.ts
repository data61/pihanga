import {
  EditorState,
  RichUtils,
  SelectionState,
  Modifier,
  ContentBlock,
} from 'draft-js';
import {
  addLineBreakRemovingSelection,
  changeDepth,
} from 'draftjs-utils';
import { createLogger } from '@pihanga/core';

// defined in @types/draft-js, but apparently not exported
type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;

const logger = createLogger('editor:handleNewLine');

export const DEF_BLOCK_STYLE = 'paragraph';

/**
 * Define block type after <CR>
 */
const NEXT_BLOCK_STYLE = {
  'paragraph': DEF_BLOCK_STYLE,
  'title': DEF_BLOCK_STYLE,
  'header-one': DEF_BLOCK_STYLE,
  'header-two': DEF_BLOCK_STYLE,
  'header-three': DEF_BLOCK_STYLE,
} as {[key:string]:string};


/**
 * The function will handle keypress 'Enter' in editor. Following are the scenarios:
 *
 * 1. Shift+Enter, Selection Collapsed -> line break will be inserted.
 * 2. Shift+Enter, Selection not Collapsed ->
 *      selected text will be removed and line break will be inserted.
 * 3. Enter, Selection Collapsed ->
 *      if current block is of type list and length of block is 0
 *      a new list block of depth less that current one will be inserted.
 * 4. Enter, Selection Collapsed ->
 *      if current block not of type list, a new unstyled block will be inserted.
 * taken from: https://github.com/jpuri/draftjs-utils/blob/master/js/keyPress.js
 */
export default function handleReturn(event: SyntheticKeyboardEvent, eState: EditorState): [boolean, EditorState] {
  const es = _handleReturn(eState, event);
  return [es !== null, es ? es : eState];
}

function _handleReturn(eState: EditorState, event: SyntheticKeyboardEvent): EditorState | null {
  if (isSoftNewlineEvent(event)) {
    const selection = eState.getSelection();
    if (selection.isCollapsed()) {
      return RichUtils.insertSoftNewline(eState);
    }
    return addLineBreakRemovingSelection(eState);
  }
  return handleHardNewlineEvent(eState);
}

/**
 * Function will handle followind keyPress scenarios when Shift key is not pressed.
 * taken from: https://github.com/jpuri/draftjs-utils/blob/master/js/keyPress.js
 */
function handleHardNewlineEvent(editorState: EditorState): EditorState | null {
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    const contentState = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const bt = block.getType();
    const isListBlock = bt === 'unordered-list-item' || bt === 'ordered-list-item';
    const atEoln = block.getLength() === selection.getStartOffset();
    if (!isListBlock && atEoln) {
      return insertNewBlock(NEXT_BLOCK_STYLE[bt] || DEF_BLOCK_STYLE, editorState);
    } else if (isListBlock && blockIsEmpty(block)) {
      const depth = block.getDepth();
      if (depth === 0) {
        return setBlockStyle(DEF_BLOCK_STYLE,  blockKey, true, editorState);
      } if (depth > 0) {
        return changeDepth(editorState, -1, depth);
      }
    }
  }
  return null;
}

function blockIsEmpty(block: ContentBlock) {
  return (block.getLength() === 0 || block.getText().trim().length === 0);
}

/**
* Function to check is event was soft-newline
* taken from : https://github.com/facebook/draft-js/blob/master/src/component/utils/isSoftNewlineEvent.js
*/
function isSoftNewlineEvent(e: SyntheticKeyboardEvent) {
  return e.which === 13 && (
    e.getModifierState('Shift') ||
    e.getModifierState('Alt') ||
    e.getModifierState('Control')
  );
}

/**
 * Function will inset a new unstyled block.
 */
function insertNewBlock(style: string, editorState: EditorState) {
  const cs1 = Modifier.splitBlock(
    editorState.getCurrentContent(),
    editorState.getSelection()
  );
  const sel1 = cs1.getSelectionAfter();
  const cs2 = Modifier.setBlockType(cs1, sel1, style);
  logger.info('Adding new block of type', style);
  const es = EditorState.push(editorState, cs2, 'split-block');
  return es;
}

export function setBlockStyle(style: string, blockID: string, setSelection: boolean, editorState: EditorState) {
  const sel = SelectionState.createEmpty(blockID);
  const cs = Modifier.setBlockType(editorState.getCurrentContent(), sel, style);
  const es = EditorState.push(editorState, cs, 'change-block-type');
  if (setSelection) {
    return EditorState.forceSelection(es, sel);
  } else {
    return es;
  }
}
