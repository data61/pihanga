import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import isObject from 'lodash.isobject';

import styled from './form.style';

/*
 * A card displaying a form:
 
 <code>
   registerForm: {
    cardType: 'PiForm',
    submitLabel: 'Register',
    spacing: 2,
    autoFocus: 'firstName',
    fields: [
      {id: "firstName", type: "textField", label: "First Name", required: true,
         mui: {variant:  'outlined', autoComplete: "fname" }, grid: {xs: 12 sm: 6}},
      {id: "lastName", type: "textField", label: "Last Name", required: true,
         mui: {variant:  'outlined', autoComplete: "lname" }, grid: {xs: 12 sm: 6}},
      {id: "email", type: "textField", label: "Email Adxdress", required: true,
         mui: {variant:  'outlined', autoComplete: "email" }, grid: {xs: 12}},
      {id: "password", type: "textField", label: "Email Adxdress", required: true,
         mui: {variant:  'outlined', autoComplete: "current-password" type: "password" }, grid: {xs: 12}},
      {id: "plan", type: "selectField", label: "Plan", options: ['Gold', 'Silver', 'Bronze'] },
    ],
    grid: {xs: 11},
    mui: {outer: {style: {paddingTop: 30}}},
  },
</code>
 * 
 */

export const PiForm = styled(({
  cardName, 
  fields,
  autoFocus,
  values = {},
  submitLabel = 'Submit',
  spacing = 2,
  onFormSubmit,
  onValueChanged,
  grid = {xs: 12, sm:12},
  mui = {},
  classes
}) => {
  const requiredFields = {};
  fields.forEach(r => {
    if (r.required) {
      requiredFields[r.id] = (values[r.id] || '') === ''
    }
  });

  function onSubmit(event) {
    const el = event.target.elements;
    const s = {};
    fields.forEach(r => {
      if (r.type === 'checkBox') {
        s[r.id] = el[r.id].checked ? r.id : '';
      } else {
        s[r.id] = el[r.id].value;
      }
    });
    onFormSubmit(s);
    event.preventDefault();
  }

  function anyRequiredNotSet() {
    console.log(requiredFields, values);
    return Object.values(requiredFields).find(f => f) !== undefined;
  }

  function onChange(id, value) {
    const missing = value === '';
    onValueChanged({
      fieldID: id,
      value,
      valid: !missing
    });
  }

  function addEntryField(r) {
    const {id, label, required = false, grid = {xs: 12, sm:12}, mui = {}} = r;
    const v = values[id] || '';
    return (
      <Grid key={id} item {...grid}>
        <TextField
          id={id}
          label={label}
          name={id}
          required={required}
          value={v}
          fullWidth
          autoComplete={id}
          autoFocus={autoFocus === id}
          onChange={ev => onChange(id, ev.target.value)}
          {...mui}
        />
      </Grid>
    );
  }

  function addCheckboxField(r) {
    let {id, label, required = false, grid={xs: 12, sm:12}, mui = {color: "primary"}} = r;
    const v = values[id] || '';
    return (
      <Grid key={id} item {...grid}>
        <FormControlLabel 
          label={label}
          required={required} 
          control={<Checkbox 
                      id={id} 
                      value={v} 
                      checked={v === id}
                      {...mui}
                      onChange={ev => onChange(id, ev.target.checked ? id : '')}  />}
        />
      </Grid>
    )
  }

  function getOption(o, i) {
    const ish = isObject(o);
    const label = ish ? o.label : o;
    const id = ish ? o.id : i;
    return (<option key={i} value={id}>{label}</option>);
  }

  function addSelectField(r) {
    const {id, label, required = false, options = [], help, grid = {xs: 12, sm:12}} = r;
    const v = values[id] || '';
    return (
      <Grid key={id} required={required} item {...grid}>
        <FormControl className={classes.selectControl} required={required} >
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select
            native
            value={v}
            fullWidth
            inputProps={{
              name: label,
              id: id,
            }}
            onChange={ev => onChange(id, ev.target.value)}
          >
            <option value="" />
            { options.map(getOption) }
          </Select>
          { help ? <FormHelperText>{help}</FormHelperText> : null }
        </FormControl>
      </Grid>
    )
  }

  function addFields() {
    return fields.map(r => {
      let {type} = r;
      switch (type) {
        case "textField": 
          return addEntryField(r);
        case "checkBox": 
          return addCheckboxField(r);
        case "selectField":
          return addSelectField(r);
        default:
          throw new Error(`Unsupported type '${type}`);
      }
    });
  }

  function addSubmitButton() {
    const slh = isObject(submitLabel) ? submitLabel : {label: submitLabel, mui: {}};
    const {variant = 'contained', fullWidth = true, color = 'primary' } = slh.mui || {};
    let {disabled = false} = slh;
    if (!disabled) {
      disabled = anyRequiredNotSet();
    }
    return (       
      <Button
        type="submit"
        disabled={disabled}
        fullWidth={fullWidth}
        variant={variant}
        color={color}
        className={classes.submit}
        {...mui.submit}
      >
        {slh.label}
      </Button>
    );
  }
 
  return (
    <Grid item {...grid} {...mui.outer} className={classes.card}>
      <form className={classes.form} onSubmit={onSubmit} noValidate {...mui.form}>
        <Grid container spacing={spacing} >
          {addFields() }
        </Grid>
        { addSubmitButton() }
      </form>
    </Grid>
  );
});