import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
// import FilterNone from '@material-ui/icons/FilterNone';
import EditIcon from '@material-ui/icons/Edit';
import PublicIcon from '@material-ui/icons/Public';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { entitiesForSelection } from '@pihanga/draftjs-core';
import styled from './linkDialog.display.style';
import { StyleName } from './index';

/**
 * Implements a simple text input for a URL.
 *
 * This is a bit of a kludge as it tries to maintain most
 * state internally, but
 */
export const LinkDialogDisplay = styled(({
  url,
  editorState,
  editorID,

  onEdit,
  onSelected,
  onClose,
  classes,
}) => {
  const es = entitiesForSelection(editorState.getCurrentContent(), editorState.getSelection());
  const le = es.find(e => e.getType() === StyleName);
  if (!le) {
    // selection moved away from link
    onClose({ editorID });
    return null;
  }
  if (le.getData().url !== url) {
    // must have clicked on a different url by now
    return null;
  }

  function onEditClick(e) {
    e.preventDefault();
    onEdit({ editorID, url });
    return false;
  }

  function onRemoveLink(e) {
    e.preventDefault();
    onSelected({ editorID, url: '' });
    return false;
  }

  return (
    <Paper className={classes.paper}>
      <PublicIcon className={classes.icon}/>
      <a
        className={classes.link}
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        data-tooltip-only-on-overflow="true"
        aria-label={url}
        data-tooltip={url}
      >
        {url}
      </a>
      {/* <IconButton aria-label="Copy link" className={classes.iconButton}>
        <FilterNone />
      </IconButton> */}
      <IconButton aria-label="Edit link" onClick={onEditClick} className={classes.iconButton}>
        <EditIcon />
      </IconButton>
      <IconButton aria-label="Remove link" onClick={onRemoveLink} className={classes.iconButton}>
        <LinkOffIcon />
      </IconButton>
    </Paper>
  );
});

export default LinkDialogDisplay;
