/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { EditorState, SelectionState, Entity } from 'draft-js';
import { getSelectedBlocksType } from 'draftjs-utils';
import { Card } from '@pihanga/core';
import Paper from '@material-ui/core/Paper';
import { entitiesForSelection } from '@pihanga/draftjs-core';
import { SelectionPopper } from '../selectionPopper';

import { StyleOpenAction, StyleCloseAction } from './index';
import styled from './styleMenu.style';

type StyleMenuType = {
  activePopper: string;
  items: string[];
  editorID: string;
  editorState: EditorState;
  onOpen: (e: StyleOpenAction) => void;
  onClose: (e: StyleCloseAction) => void;
  classes: any;
};

export const StyleMenu = styled((props: StyleMenuType) => {
  const {
    activePopper,
    items = [],
    editorID,
    editorState,
    onOpen,
    onClose,
    classes,
  } = props;
  const oldSelection = React.useRef(null) as { current: SelectionState | null };
  const styles = React.useRef(null) as { current: Entity[] | null };
  const blockType = React.useRef(null) as { current: string | null };

  if (activePopper && activePopper !== 'style') {
    return null;
  }
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    if (oldSelection.current !== null) {
      onClose({
        editorID,
      });
    }
    oldSelection.current = null;
    return null;
  }

  const oldS = oldSelection.current;
  if (!oldS || hasSelectionChanged(selection, oldS)) {
    oldSelection.current = selection;
    const cs = editorState.getCurrentContent();
    styles.current = entitiesForSelection(cs, selection).map((e) => {
      return { type: e.getType(), data: e.getData() };
    });
    blockType.current = getSelectedBlocksType(editorState);

    onOpen({
      editorID,
      styles: styles.current,
      blockType: blockType.current,
      selection,
    } as StyleOpenAction);
  }

  const MenuIcon = (name: string, id: number) => (
    <Card
      cardName={name}
      key={id}
      editorID={editorID}
      selection={selection}
      styles={styles.current}
      blockType={blockType.current}
    />
  );

  return (
    <SelectionPopper selection={selection} forceShow placement="bottom-start">
      <Paper square className={classes.paper}>
        { items.map(MenuIcon) }
      </Paper>
    </SelectionPopper>
  );
});

function hasSelectionChanged(sel1: SelectionState, sel2: SelectionState) {
  return sel1.getAnchorKey() !== sel2.getAnchorKey()
  || sel1.getAnchorOffset() !== sel2.getAnchorOffset()
  || sel1.getFocusKey() !== sel2.getFocusKey()
  || sel1.getFocusOffset() !== sel2.getFocusOffset();
}
