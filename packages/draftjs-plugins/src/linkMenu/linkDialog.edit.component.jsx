import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import styled from './linkDialog.edit.style';
import { timeout } from 'q';

/**
 * Implements a simple text input for a URL. 
 * 
 * This is a bit of a kludge as it tries to maintain most 
 * state internally, but 
 */
export const LinkDialogEdit = styled(({
  url,
  editorID,

  onSelected,
  onValue,
  onClose,
  classes,
}) => {
  // see 'onBlur' why we need this
  // const activated = React.useRef(Date.now());
  const closeTimeout = React.useRef();

  // if (!activated.current) {
  //   activated.current = Date.now();
  // }

  const dispatch = (url, f) => {
    f({editorID, url});
  }

  function onSelect(e) {
    console.log("LINK SELECT", e);
  }

  function onChange(e) {
    const v = e.target.value;
    console.log("LINK VALUE", v, v.length);
    dispatch(v, onValue);
  }

  function onSubmit(e) {
    console.log("LINK SUBMIT", e);
    dispatch(url, onSelected);
    onClose({editorID});
    e.preventDefault();
    return false;
  }

  /**
   * Currently we trigger a 'onClose' event when this dialog looses focus. However,
   * we still trigger an 'onBlur' event when we try to switch between the two text
   * fields. So we delay the 'onClose' by a bit and delete the timeout if in the 
   * mean time the other filed gets focus. 
   * 
   * Maybe a cleaner solution is to look at the selection, like 'linkDialog.display'
   * or add a 'cancel' button to exit the dialog prematurely.
   */
  function onBlur() {
    // console.log("LINK BLUR");
    closeTimeout.current = setTimeout(() => {
      closeTimeout.current = null;
      onClose({editorID});
    }, 100);
    // For reasons I don't understand, 'onBlur' is called immediately
    // after setting 'focus()' in input's ref callback. We therefore
    // ignore all 'onBlur' events in the first 1000 msec.
    // if ((Date.now() - activated.current) > 1000) {
    //   onClose({editorID});
    // }
  }

  function onFocus() {
    // console.log("LINK FOCUS");
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }

  // /**
  //  * Set focus on text field when dialog opens.
  //  * 
  //  * This may again called when the dialog uses focus
  //  * but we have delayed the 'onClose' event to allow 
  //  * switching focus between the two text fields.
  //  */
  // function focusField(el) {
  //   return el && !closeTimeout.current && el.focus()
  // }

  function checkSubmit(e) {
    if(e && e.keyCode == 13) {
       onSubmit(e);
    }
  }

  // Paste a link, or search
  return (
    <Paper className={classes.paper} >
      <form onSubmit={onSubmit} autoComplete="off" onBlur={onBlur}>
        <div className={classes.col}>
          <div className={classes.row}>
            <TextField 
              id="linkDialog-edit-text" 
              label="Text" 
              value={url || ''}
              onChange={onChange}
              variant="outlined"
              size="small"
              className={classes.textField}
              onFocus={onFocus}
            />
          </div>
          <div className={classes.row}>
            <TextField 
              id="linkDialog-edit-url"
              autoFocus
              label="Link" 
              value={url || ''}
              onChange={onChange}
              variant="outlined"
              size="small"
              className={classes.textField}
              onFocus={onFocus}
              // a bit kludgy, but not sure how to do this otherwise
              inputProps={{onKeyUp: checkSubmit}}
            />
          </div>
        </div>
      </form>
    </Paper>
  );
});

export default LinkDialogEdit;
