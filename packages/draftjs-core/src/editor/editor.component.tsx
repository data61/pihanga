import * as React from 'react';
import {
  Editor,
  EditorState,
  DefaultDraftBlockRenderMap,
  ContentBlock,
  ContentState,
  DraftHandleValue,
  RichUtils,
  getDefaultKeyBinding,
} from 'draft-js';
import { Card } from '@pihanga/core';
import * as Immutable from 'immutable';
// import { createLogger } from '@pihanga/core';

// import handleReturn from './handleReturn';
// import { keyBindingFn, handleKeyCommand } from './handleKeyCommand';
// import handleBeforeInput from './handleBeforeInput';
import BlockComponent, { Props as BCProps } from './block.component';
import { getCatalog } from '../util';
import {
  BlockRendererFnMap,
  BlockRendererFn,
  HandleReturnFn,
  HandleBeforeInputFn,
  HandleKeyCommandFn,
  HandleKeyBindingFn,
  PiComponentProps,
  BlockRenderDef,
  PiEditorActionUpdate,
} from './api';

import 'draft-js/dist/Draft.css';
import './draft.css';
import styled from './editor.style';

// const logger = createLogger('editor');

export const DEF_SAVE_INTERVAL_MS = 30000;

export type Props = PiComponentProps & {
  cardName: string;
  documentID: string;
  catalogKey: string;
  // onOpen,
  captureTab: boolean; // when true prevent tab to blur
  readOnly: boolean;
  autoSave: boolean;
  saveIntervalMS?: number;
  stateSavedAt?: number; // comes from pihanga state
  withSpellCheck: boolean; // true,
  plugins: any[];
  extensions: {[key: string]: any};
  editorState: EditorState;
  onUpdate: (ev: PiEditorActionUpdate) => void;
};

// export type UpdateEvent = {
//   editorID: string;
//   documentID: string;
//   editorState: EditorState;
//   blocksChanged: string[];
//   entitiesHaveChanged: boolean;
//   selHasChanged: boolean;
//   selection?: {
//     anchor: {
//       key: string;
//       offset: number;
//     };
//     focus: {
//       key: string;
//       offset: number;
//     };
//     hasFocus: boolean;
//   };
//   autoSave: boolean;
// };

type BlockRenderFnProvider = (type: string) => BlockRendererFn<unknown, BCProps>;
const DEF_BLOCK_RENDER_FN: BlockRenderFnProvider = (type) => (
  _1, editorID, _2, { documentID, readOnly },
): BlockRenderDef<BCProps> => ({
  component: BlockComponent,
  editable: !readOnly,
  props: { editorID, documentID, type },
});

export const BlockType2Renderer: BlockRendererFnMap = {
  title: DEF_BLOCK_RENDER_FN('title'),
  paragraph: DEF_BLOCK_RENDER_FN('paragraph'),
};

type Ext = {
  name: string;
  priority: number;
};

export const HandleReturnExtensions = [
] as (Ext & {f: HandleReturnFn<never>})[];

export const HandleBeforeInputExtensions = [
] as (Ext & {f: HandleBeforeInputFn<never>})[];

export const HandleKeyCommandExtensions = [
] as (Ext & {f: HandleKeyCommandFn<never>})[];

export const KeyBindingFnExtensions = [
  { name: '__default__', priority: 100, f: defKeyBindingFn },
] as (Ext & {f: HandleKeyBindingFn<never>})[];

const MAX_LIST_DEPTH = 4;
const TAB_KEY_CODE = 9; // TAB key

function defKeyBindingFn(
  e: SyntheticKeyboardEvent,
  eState: EditorState,
): [boolean, string | null, EditorState] {
  switch (e.keyCode) {
    case TAB_KEY_CODE: {
      // Unfortunately, 'onTab' doesn't cleanly separate key binding and
      // key command handling, so we need to deal with eState here.
      const es = RichUtils.onTab(e, eState, MAX_LIST_DEPTH);
      // onChange(es);
      // return null;
      return [true, null, es];
    }
    default: {
      const b = getDefaultKeyBinding(e) as string|null;
      return [true, b, eState];
    }
  }
}

const DEF_OPTS = {
  documentID: 'default',
  document: {},
  captureTab: false,
  readOnly: false,
  autoSave: true,
  saveIntervalMS: DEF_SAVE_INTERVAL_MS,
  withSpellCheck: false, // true,
  plugins: [], // ['styleMenu', 'linkDialog'],
  extensions: {},
};

export const EditorComponent = styled((opts: ClassedProps<Props>) => {
  const {
    documentID,
    catalogKey,
    // onOpen,
    captureTab,
    readOnly,
    autoSave,
    saveIntervalMS,
    withSpellCheck, // true,
    plugins,
    extensions,
    classes,
  } = { ...DEF_OPTS, ...opts };

  if (!documentID) {
    return null;
  }

  const eState = opts.editorState;
  if (!eState) {
    return null;
  }

  const editorID = opts.cardName;
  const isFocused = eState.getSelection().getHasFocus();
  let isPasted = false;

  // HACK ALERT: The content state's entity map is this weird global non-queryable
  // thing. However, we want some 'names' entity support. So we create a 'CATALOG'
  // entity in each EditorState, but aswe can't control it's 'key' we need to keep
  // a mapping. We set that mapping every time.
  function setEState(es: EditorState): void {
    const cs = es.getCurrentContent();
    const bm = cs.getBlockMap();
    let changed = false;
    const blocksChanged = [] as string[];
    const origCS = eState.getCurrentContent();
    const origBM = origCS.getBlockMap();
    const bm2 = bm.map((block) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const b = block!;
      const bk = b.getKey(); // b should never be undefined
      if (b !== origBM.get(bk)) {
        blocksChanged.push(bk);
      }
      const d = b.getData();
      const d2 = d.set('CATALOG_KEY', catalogKey);
      if (d === d2) {
        return b;
      }
      changed = true;
      return b.merge({ data: d2 }) as ContentBlock;
    });
    let es2 = es;
    if (changed) {
      const cs2 = cs.merge({ blockMap: bm2 }) as ContentState;
      es2 = EditorState.push(es, cs2, 'change-block-data');
    }

    const entitiesHaveChanged = getCatalog(cs) !== getCatalog(origCS);
    const sel2 = es2.getSelection();
    const selHasChanged = es2 !== eState && sel2 !== eState.getSelection();
    if (es2 !== eState || entitiesHaveChanged) {
      const evt = {
        editorID,
        documentID: opts.documentID,
        editorState: es2,
        blocksChanged,
        entitiesHaveChanged,
        selHasChanged,
        isPasted,
        isFocused: sel2.getHasFocus(),
        autoSave,
        saveIntervalMS,
      } as PiEditorActionUpdate;

      if (selHasChanged) {
        const s = es2.getSelection();
        evt.selection = {
          anchor: {
            key: s.getAnchorKey(),
            offset: s.getAnchorOffset(),
          },
          focus: {
            key: s.getFocusKey(),
            offset: s.getFocusOffset(),
          },
          hasFocus: s.getHasFocus(),
        };
      }
      opts.onUpdate(evt);
    }
  }

  function onChange(es: EditorState): void {
    setEState(es);
  }

  // function onBlur(): void {
  //   isFocused.current = false;
  // }

  // function onFocus(): void {
  //   isFocused.current = true;
  // }

  function handleReturn(ev: SyntheticKeyboardEvent, editorState: EditorState): DraftHandleValue {
    const [handled2, es2] = HandleReturnExtensions.reduce(([handeled, es], def) => {
      if (handeled) {
        return [handeled, es];
      } else {
        const { name, f } = def;
        return f(ev, es, readOnly, extensions[name]);
      }
    }, [false, editorState]);
    return updateEState('handleReturn', editorState, es2, handled2 ? 'handled' : 'not-handled');
  }

  function handleKeyCommand(command: string, editorState: EditorState): DraftHandleValue {
    const [handled2, es2] = HandleKeyCommandExtensions.reduce(([handeled, es], def) => {
      if (handeled) {
        return [handeled, es];
      } else {
        const { name, f } = def;
        return f(command, es, readOnly, extensions[name]);
      }
    }, [undefined, editorState] as [string|undefined, EditorState]);
    return updateEState('handleKeyCommand', editorState, es2, handled2);
  }

  function handleBeforeInput(chars: string, editorState: EditorState): DraftHandleValue {
    const [handled2, es2] = HandleBeforeInputExtensions.reduce(([handeled, es], def) => {
      if (handeled) {
        return [handeled, es];
      } else {
        const { name, f } = def;
        return f(chars, es, readOnly, extensions[name]);
      }
    }, [undefined, editorState] as [string|undefined, EditorState]);
    return updateEState('handleBeforeInput', editorState, es2, handled2);
  }

  function handlePastedText(): DraftHandleValue {
    isPasted = true;
    return 'not-handled';
  }

  function updateEState(
    name: string,
    oldEs: EditorState,
    newEs: EditorState,
    handled: string | undefined,
  ): DraftHandleValue {
    const hdl = (handled || 'not-handled') as DraftHandleValue;
    if (oldEs !== newEs) {
      setEState(newEs);
      if (hdl === 'not-handled') {
        console.warn(`editor.component: ${name} changed editorState but didn't fully handle comand`);
      }
    }
    return hdl;
  }

  function keyBindingFn(ev: SyntheticKeyboardEvent): string | null {
    const [_, command, es2] = KeyBindingFnExtensions.reduce((p, def) => {
      const [handled, _2, es] = p;
      if (handled) {
        return p;
      } else {
        const { name, f } = def;
        return f(ev, es, extensions[name]);
      }
    }, [false, null as string | null, eState]);
    if (eState !== es2) {
      setEState(es2);
    }
    if (captureTab && ev.keyCode === TAB_KEY_CODE) {
      ev.preventDefault();
    }
    return command;
  }

  function blockRendererFn(contentBlock: ContentBlock): BlockRenderDef<any> | null {
    const type = contentBlock.getType();
    // console.log('RENDER BLOCK', type);
    const renderer = BlockType2Renderer[type];
    if (renderer) {
      return renderer(contentBlock, editorID, extensions[type], opts, isFocused);
    }
    return null;
  }

  // function renderBubble() {
  //   const style = {
  //     top: 89,
  //     right: -20,
  //     opacity: 1,
  //     zIndex: 101,
  //     transition: 'opacity 0.25s ease-in-out 0s',
  //     boxShadow: 'rgba(0, 0, 0, 0.05) 0px 3px 3px',
  //     position: 'absolute',
  //     width: '40px',
  //     height: '40px',
  //     textAlign: 'center',
  //     borderWidth: 1,
  //     borderStyle: 'solid',
  //     borderColor: 'rgb(238, 238, 238)',
  //     borderImage: 'initial',
  //     background: 'rgba(255, 255, 255, 0.85)',
  //     borderRadius: '100%',
  //     overflow: 'hidden',
  //   };
  //   return (
  //     <div
  //       role="button"
  //       tabIndex={-1}
  //       aria-hidden="true"
  //       aria-label="Add a comment"
  //       data-tooltip="Add a comment"
  //       style={style}
  //     />
  //   );
  // }

  // const MyUL = (props: {[key: string]: any}) => {
  //   console.log('MyUL:', props);
  //   return (
  //     <ul data-offset-key={props['data-offset-key']} className="public-DraftStyleDefault-ul">
  //       {props.children}
  //     </ul>
  //   );
  // };

  // const MyLi = (props: {[key: string]: any}) => {
  //   console.log('MYWRAPPER:', props.children[0], props);
  //   return (
  //     <li
  //       data-block={props['data-block']}
  //       data-editor={props['data-editor']}
  //       data-offset-key={props['data-offset-key']}
  //     >
  //       {props.children}
  //     </li>
  //   );
  // };

  // const blockRenderMap = Immutable.Map({
  //   'unordered-list-item': {
  //     // element is used during paste or html conversion to auto match your component;
  //     // it is also retained as part of this.props.children and not stripped out
  //     element: 'section',
  //     wrapper: <MyWrapper />,
  //   }
  // });

  // keep support for other draft default block types and add our myCustomBlock type
  const blockRenderMap = DefaultDraftBlockRenderMap.merge(Immutable.Map({
    // 'xunordered-list-item': {
    //   // element is used during paste or html conversion to auto match your component;
    //   // it is also retained as part of this.props.children and not stripped out
    //   element: 'li', // 'MyLi',
    //   wrapper: <MyUL />,
    //   // wrapper: <ul/>
    // },
  }));

  const editorOpts = {
    key: 1,
    editorState: eState,
    readOnly, // handle ourselve,
    onChange,
    handleKeyCommand,
    handleReturn,
    handleBeforeInput,
    handlePastedText,
    // preserveSelectionOnBlur
    blockRenderMap,
    blockRendererFn,
    keyBindingFn,
    spellCheck: withSpellCheck,
    className: classes.inner,
    styles: { width: '100%', overflowY: 'unset' },
  };

  function createPluginCard(p: any, i: number): JSX.Element {
    return (
      <Card
        cardName={p.cardName}
        key={i}
        editorID={editorID}
        isFocused={isFocused}
      />
    );
  }

  return (
    <div className={classes.outer}>
      <Editor {...editorOpts} />
      { plugins.map(createPluginCard)}
    </div>
  );
}) as React.FunctionComponent<Props>;
