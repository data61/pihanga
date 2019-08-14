import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//import { createScratch } from 'n1-core/app';

//import {  } from './toolbar-switch.actions';
import styled from './toolbar-switch.style';


export const ToolbarSwitch = styled(({ label, checked = false, onChange, classes }) => {
  const cl = {
    default: classes.switchDefault, 
    checked: classes.switchChecked,
    bar: classes.switchBar,
  };
  return (
    <FormControlLabel 
      control={
        <Switch
          checked={checked}
          classes={ cl }
        />
      }
      label={label}
      onChange={ onChange || (() => {}) }
      classes={{label: classes.label, root: classes.root }}
    />
  );
});