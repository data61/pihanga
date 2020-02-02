import * as React from 'react';
import {
  Editor,
  EditorState,
  DefaultDraftBlockRenderMap,
  ContentBlock,
  ContentState,
  DraftHandleValue,
} from 'draft-js';
import { Card } from '@pihanga/core';
import * as Immutable from 'immutable';
// import { createLogger } from '@pihanga/core';

import handleReturn from './handleReturn';
import { keyBindingFn, handleKeyCommand } from './handleKeyCommand';
import handleBeforeInput from './handleBeforeInput';
import BlockComponent, { Props as BCProps } from './block.component';
import { getCatalog } from '../util';
import {
  BlockRendererFnMap,
  BlockRendererFn,
  HandleReturnFn,
  HandleBeforeInputFn,
  HandleKeyCommandFn,
  PiComponentProps,
} from './api';

import 'draft-js/dist/Draft.css';
import './draft.css';
import styled from './editor.style';

// const logger = createLogger('editor');

export type Props = PiComponentProps & {
  cardName: string;
  documentID: string;
  catalogKey: string;
  // onOpen,
  readOnly: boolean;
  withSpellCheck: boolean; // true,
  plugins: any[];
  extensions: {[key: string]: any};
  editorState: EditorState;
  onUpdate: (ev: {
    editorID: string;
    documentID: string;
    editorState: EditorState;
    blocksChanged: string[];
    entitiesHaveChanged: boolean;
  }) => void;
};

const DEF_BLOCK_RENDER_FN: BlockRendererFn<unknown, BCProps> = (
  _, editorID, documentID, readOnly,
) => ({
  component: BlockComponent,
  editable: !readOnly,
  props: { editorID, documentID },
});

export const BlockType2Renderer: BlockRendererFnMap = {
  title: DEF_BLOCK_RENDER_FN,
  paragraph: DEF_BLOCK_RENDER_FN,
};

export const HandleReturnExtensions = [
  { name: '__default__', f: handleReturn },
] as {name: string; f: HandleReturnFn}[];

export const HandleBeforeInputExtensions = [
  { name: '__default__', f: handleBeforeInput },
] as {name: string; f: HandleBeforeInputFn<unknown>}[];

export const HandleKeyCommandExtensions = [
  { name: '__default__', f: handleKeyCommand },
] as {name: string; f: HandleKeyCommandFn}[];

const DEF_OPTS = {
  documentID: 'default',
  document: {},
  readOnly: false,
  withSpellCheck: false, // true,
  plugins: [], // ['styleMenu', 'linkDialog'],
  extensions: {},
};

export const EditorComponent: React.FunctionComponent<Props> = styled(
  (opts: ClassedProps<Props>) => {
    const {
      documentID,
      catalogKey,
      // onOpen,
      readOnly,
      withSpellCheck, // true,
      plugins,
      extensions,
      classes,
    } = { ...DEF_OPTS, ...opts };
    const isFocused = React.useRef(false);

    if (!documentID) {
      return null;
    }
    // console.log('>>> EDITOR UPDATE', opts);

    const editorID = opts.cardName;
    const eState = opts.editorState;

    if (!eState) {
      return null;
    }

    // HACK ALERT: The content state's entity map is this weird global non-queryable
    // thing. However, we want some 'names' entity support. So we create a 'CATALOG'
    // entity in each EditorState, but aswe can't control it's 'key' we need to keep
    // a mapping. We set that mapping every time.
    function setEState(es: EditorState) {
      const cs = es.getCurrentContent();
      const bm = cs.getBlockMap();
      let changed = false;
      const blocksChanged = [] as string[];
      const origCS = eState.getCurrentContent();
      const origBM = origCS.getBlockMap();
      const bm2 = bm.map(block => {
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

      const entitiesHaveChanged = getCatalog(cs) !== getCatalog(origCS)
      if (es2 !== opts.editorState || entitiesHaveChanged) {
        opts.onUpdate({
          editorID,
          documentID: opts.documentID,
          editorState: es2,
          blocksChanged,
          entitiesHaveChanged
        });
      }
    }

    function onChange(es: EditorState) {
      setEState(es);
    }

    function onBlur(e: React.SyntheticEvent) {
      // console.log("## BLURRED", e);
      isFocused.current = false;
    }

    function onFocus(e: React.SyntheticEvent) {
      // console.log("## FOCUSSED", e);
      isFocused.current = true;
    }

    function handleReturn(ev: SyntheticKeyboardEvent, editorState: EditorState) {
      const [handled2, es2] = HandleReturnExtensions.reduce(([handeled, es], def) => {
        if (handeled) {
          return [handeled, es];
        } else {
          const { name, f } = def;
          return f(ev, es, readOnly, extensions[name]);
        }
      }, [false, editorState]);
      if (editorState !== es2) {
        setEState(es2);
      }
      return (handled2 ? 'handled' : 'not-handled') as DraftHandleValue;
    }

    function _handleKeyCommand(command: string, editorState: EditorState) {
      const [handled2, es2] = HandleKeyCommandExtensions.reduce(([handeled, es], def) => {
        if (handeled) {
          return [handeled, es];
        } else {
          const { name, f } = def;
          return f(command, es, readOnly, extensions[name]);
        }
      }, [undefined, editorState] as [string|undefined, EditorState]);
      if (editorState !== es2) {
        setEState(es2);
      }
      return (handled2 ? handled2 : 'not-handled') as DraftHandleValue;
    }

    function _handleBeforeInput(chars: string , editorState: EditorState) {
      const [handled2, es2] = HandleBeforeInputExtensions.reduce(([handeled, es], def) => {
        if (handeled) {
          return [handeled, es];
        } else {
          const { name, f } = def;
          return f(chars, es, readOnly, extensions[name]);
        }
      }, [undefined, editorState] as [string|undefined, EditorState]);
      if (editorState !== es2) {
        setEState(es2);
      }
      return (handled2 || 'not-handled') as DraftHandleValue;
    }

    function _keyBindingFn(e: SyntheticKeyboardEvent): string|null {
      return keyBindingFn(e, eState, onChange);
    }

    function blockRendererFn(contentBlock: ContentBlock) {
      const type = contentBlock.getType();
      // console.log('RENDER BLOCK', type);
      const renderer = BlockType2Renderer[type];
      if (renderer) {
        return renderer(contentBlock, editorID, documentID, readOnly, extensions[type]);
      }
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

    const MyUL = (props: {[key: string]: any}) => {
      console.log('MyUL:', props);
      return (
        <ul data-offset-key={props['data-offset-key']} className="public-DraftStyleDefault-ul">
          {props.children}
        </ul>
      );
    }

    const MyLi = (props: {[key: string]: any}) => {
      console.log('MYWRAPPER:', props.children[0], props);
      return (
        <li
          data-block={props['data-block']}
          data-editor={props['data-editor']}
          data-offset-key={props['data-offset-key']}
        >
          {props.children}
        </li>
      );
    }

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
      'xunordered-list-item': {
        // element is used during paste or html conversion to auto match your component;
        // it is also retained as part of this.props.children and not stripped out
        element: 'li', // 'MyLi',
        wrapper: <MyUL/>,
        //wrapper: <ul/>
      }
    }));

    const editorOpts = {
      key: 1,
      editorState: eState,
      readOnly: readOnly, // handle ourselve,
      onChange,
      handleKeyCommand: _handleKeyCommand,
      handleReturn: handleReturn,
      handleBeforeInput: _handleBeforeInput,
      // preserveSelectionOnBlur
      blockRenderMap: blockRenderMap,
      blockRendererFn: blockRendererFn,
      keyBindingFn: _keyBindingFn,
      spellCheck: withSpellCheck,
      className: classes.inner,
      styles: { width: '100%', overflowY: 'unset' },
    };

    return (
      <div className={classes.outer} onFocus={onFocus} onBlur={onBlur}>
        <Editor {...editorOpts} />
        { plugins.map((p,i) => (<Card cardName={p.cardName} key={i} editorID={editorID} isFocused={isFocused.current}/>))}

        {/* <Card cardName='styleMenu' editorID={editorID} isFocused={isFocused.current}/>
        <Card cardName='linkDialog' editorID={editorID} isFocused={isFocused.current}/> */}
        {/* { renderBubble() } */}
      </div>
    );
}) as React.FunctionComponent<Props>;
