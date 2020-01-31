import * as React from 'react';
import { getSelectedBlocksType } from 'draftjs-utils';
import { Card } from '@pihanga/core';
import Paper from '@material-ui/core/Paper';
import { entitiesForSelection } from '@pihanga/draftjs-core';
import { SelectionPopper } from '../selectionPopper';

import styled from './styleMenu.style';

export const StyleMenu = styled(({
  activePopper,
  items = [],
  editorID,
  editorState,
  onOpen,
  onClose,
  classes,
}) => {
  const oldSelection = React.useRef(null);
  const styles = React.useRef(null);
  const blockType = React.useRef(null);

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
  if (!oldS || ['anchorKey', 'anchorOffset', 'focusKey', 'focusOffset'].reduce((f, k) => {
    return f || selection[k] !== oldS[k];
  }, false)) {
    oldSelection.current = selection;
    const cs = editorState.getCurrentContent();
    styles.current = entitiesForSelection(cs, selection).map(e => {
      return { type: e.getType(), data: e.getData() };
    });
    blockType.current = getSelectedBlocksType(editorState);

    onOpen({
      editorID,
      styles: styles.current,
      blockType: blockType.current,
      selection,
    });
  }

  const MenuIcon = (name, id) => (
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
    <SelectionPopper selection={selection} forceShow placement= 'bottom-start'>
      <Paper square className={classes.paper} >
        { items.map(MenuIcon) }
      </Paper>
    </SelectionPopper>
  );
})
