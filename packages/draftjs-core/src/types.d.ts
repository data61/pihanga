declare module "draftjs-utils" {
  import {EditorState} from 'draft-js';

  export function addLineBreakRemovingSelection(editorState: EditorState): EditorState;
  export function changeDepth(editorState: EditorState, adjustment: number, maxDepth: number): EditorState;
}

// declare module 'draft_js'  {
//   import {DraftEntityType, DraftEntityMutability} from 'draft-js';

//   // // this is identical to 'DraftEntityInstance' which is unfortunately not exported
//   // interface Entity {
//   //   getType(): DraftEntityType,
//   //   getMutability(): DraftEntityMutability,
//   //   getData(): Object,
//   // }
// }

type ClassedProps<P> = P & { 
  classes: {[name:string]:string}, 
  children?: React.ReactNode 
};

// defined in @types/draft-js, but apparently not exported
type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;