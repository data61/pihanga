// import {
//   EditorState,
//   Modifier,
//   SelectionState,
//   ContentBlock,
//   DraftRemovalDirection,
// } from 'draft-js';
// import { DEF_BLOCK_STYLE, setBlockStyle } from './handleReturn';

// const UNORDERED_LIST_STYLE = 'unordered-list-item';
// const ORDERED_LIST_STYLE = 'ordered-list-item';

// const HEADERS = [
//   'header-one',
//   'header-two',
//   'header-three',
// ];

// type OnLineF = (
//   prefix: string,
//   block: ContentBlock,
//   blockKey: string,
//   eState?: EditorState,
// ) => EditorState | null;

// export default function handleBeforeInput(
//   chars: string,
//   eState: EditorState,
//   readOnly: boolean,
// ): [string|undefined, EditorState] {
//   if (readOnly) {
//     return ['handled', eState]; // swallow
//   }
//   const es2 = _handleBeforeInput(chars, eState);
//   return [es2 ? 'handled' : undefined, es2 || eState];
// }

// function _handleBeforeInput(char: string, eState: EditorState) {
//   let es = null;
//   if (char === '*') {
//     es = checkUnorderedListBegin(es || eState);
//   } else if (char === '.') {
//     es = checkOrderedListBegin(es || eState);
//   } else if (char === ' ') {
//     es = checkHeader(es || eState);
//   }
//   return es;
// }

// function checkUnorderedListBegin(eState: EditorState) {
//   return onLineStart(eState, (prefix, _2, blockKey) => {
//     if (prefix.length === 0) {
//       return setBlockStyle(UNORDERED_LIST_STYLE, blockKey, true, eState);
//     } else {
//       return null;
//     }
//   });
// }

// function checkOrderedListBegin(eState: EditorState) {
//   return onLineStart(eState, (prefix, block, blockKey) => {
//     if (prefix.length === 1) {
//       const c = prefix[0];
//       if (c > '0' && c <= '9') {
//         const es = setBlockStyle(ORDERED_LIST_STYLE, blockKey, true, eState);
//         return clearBlock(block, es);
//       }
//       return null;
//     } else {
//       return null;
//     }
//   });
// }

// function checkHeader(eState: EditorState) {
//   return onLineStart(eState, (prefix, block, blockKey) => {
//     if (prefix[0] === '#' && /^#+$/.test(prefix)) {
//       const level = Math.min(prefix.length, HEADERS.length);
//       const es = setBlockStyle(HEADERS[level - 1], blockKey, true, eState);
//       return clearBlock(block, es);
//     } else {
//       return null;
//     }
//   });
// }

// function onLineStart(eState: EditorState, f: OnLineF) {
//   const sel = eState.getSelection();
//   if (sel.isCollapsed()) {
//     const cs = eState.getCurrentContent();
//     const blockKey = sel.getStartKey();
//     const block = cs.getBlockForKey(blockKey);
//     const bt = block.getType();
//     if (bt === DEF_BLOCK_STYLE || bt === 'unstyled') {
//       const prefix = block.getText().trim();
//       return f(prefix, block, blockKey, eState);
//     }
//   }
//   return null;
// }

// /**
//  * Remove all text from single block
//  */
// function clearBlock(block: ContentBlock, eState: EditorState) {
//   const sel = SelectionState.createEmpty(block.getKey());
//   const sel2 = sel.merge({
//     focusOffset: block.getText().length,
//   }) as SelectionState;
//   const cs = Modifier.removeRange(
//     eState.getCurrentContent(),
//     sel2,
//     'ltr' as DraftRemovalDirection,
//   );
//   const es = EditorState.push(eState, cs, 'remove-range');
//   // keep selection on line
//   return EditorState.forceSelection(es, sel);
// }
