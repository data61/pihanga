// declare module "draftjs-utils" {
//   import {EditorState} from 'draft-js';

//   export function addLineBreakRemovingSelection(editorState: EditorState): EditorState;
//   export function changeDepth(editorState: EditorState, adjustment: number, maxDepth: number): EditorState;
// }

declare module 'valid-url' {
  export function isUri(s: string): boolean;
}
