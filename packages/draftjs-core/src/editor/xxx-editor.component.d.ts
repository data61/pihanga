// REMOVE AFTER CONVERTING editor.component to TS
import {EditorState} from 'draft-js';
import {BlockRendererFnMap} from './index';

type Opts = {
  documentID: string,
  catalogKey: string,
  readOnly: boolean,
  withSpellCheck: boolean,
  plugins: {[name:string]:any}[],
  extensions: {[name:string]:any},
  editorState: EditorState,
};
export declare function EditorComponent(opts: Opts): React.ComponentType<Opts>;

type Mapping<T> = {
  name: string, 
  f: T,
}

export declare const BlockType2Renderer: BlockRendererFnMap;
export declare const HandleReturnExtensions: Mapping<any>[];
export declare const HandleBeforeInputExtensions: Mapping<any>[];
export declare const HandleKeyCommandExtensions: Mapping<any>[];
