import * as React from 'react';
import LinkDialogDisplay from './linkDialog.display.component';
import LinkDialogEdit from './linkDialog.edit.component';
import LinkDialogEdit2 from './linkDialog.edit2.component';
import {SelectionPopper} from '../selectionPopper';

export const LinkDialog = (props) => {
  const {activePopper} = props;
  if (!activePopper || !activePopper.startsWith('link')) {
    return null;
  }

  function renderInternal() {
    if (activePopper === 'link.edit') {
      return (<LinkDialogEdit2 {...props}/>);
    } else {
      return (<LinkDialogDisplay {...props} />);
    }
  }

  const {selection, domElementID} = props;
  const popperProps = selection ? {selection} : {domElementID};
  return (
    <SelectionPopper {...popperProps} forceShow placement= 'bottom-start'> 
      { renderInternal() }
    </SelectionPopper>
  )
}
export default LinkDialog;
