/* eslint-disable no-shadow */
import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import isObject from 'lodash.isobject';

import styled from './form.style';

export const PiRadioGroupForm = styled(({
  id,
  value,
  options = [],
  label,
  rowLayout = false,
  onChange,
  // classes,
}) => {
  function renderRadio(o, i) {
    const ish = isObject(o);
    const label = ish ? o.label : o;
    const id = ish ? o.id : i;
    const disabled = ish ? o.disabled : false;
    return (
      <FormControlLabel
        key={i}
        value={id}
        disabled={disabled}
        control={<Radio />}
        label={label}
      />
    );
  }

  return (
    <RadioGroup
      aria-label={label}
      name={id}
      value={value}
      row={rowLayout}
      onChange={(ev) => onChange(ev.target.value)}
    >
      { options.map(renderRadio) }
    </RadioGroup>
  );
});
