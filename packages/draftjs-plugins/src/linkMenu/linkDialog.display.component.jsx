/* eslint-disable @typescript-eslint/no-use-before-define */
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
  link, // LinkEntityState
  editorState,
  editorID,

  onEdit,
  onSelected,
  onClose,
  classes,
}) => {
  const es = entitiesForSelection(editorState.getCurrentContent(), editorState.getSelection());
  const le = es.find((e) => e.getType() === StyleName);
  if (!le) {
    // selection moved away from link
    onClose({ editorID });
    return null;
  }
  if (le.getData().url !== link.url) {
    // must have clicked on a different url by now
    return null;
  }

  function onEditClick(e) {
    e.preventDefault();
    onEdit({ editorID, link });
    return false;
  }

  function onRemoveLink(e) {
    e.preventDefault();
    onSelected({ editorID, link: {} });
    return false;
  }

  function renderFirstLine() {
    return (
      <div className={classes.firstLine}>
        <PublicIcon className={classes.icon} />
        <a
          className={classes.link}
          target="_blank"
          rel="noopener noreferrer"
          href={link.url}
          data-tooltip-only-on-overflow="true"
          aria-label={link.title || link.url}
          data-tooltip={link.title || link.url}
        >
          {link.title || link.url}
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
      </div>
    );
  }

  function renderDomain() {
    if (!link.title) return null;
    const domain = getDomainName();
    if (!domain) return null;
    return (
      <div className={classes.domainLine}>
        { domain }
      </div>
    );
  }

  function renderSnippet() {
    if (!link.snippet) return null;
    return (
      <div className={classes.snippetLine}>
        { link.snippet }
      </div>
    );
  }

  function getDomainName() {
    try {
      return new URL(link.url).hostname;
    } catch {
      return null;
    }
  }

  return (
    <Paper className={classes.paper}>
      { renderFirstLine() }
      { renderDomain() }
      { renderSnippet() }
    </Paper>
  );
});

export default LinkDialogDisplay;
