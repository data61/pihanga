import { ACTION_TYPES } from './form.actions';
import initReducers from './form.reducers';
import { PiForm } from './form.component';
import { PiRadioGroupForm } from './radioGroup.component';

export * from './form.actions';


export function init(register) {
  initReducers(register.reducer);
  register.cardComponent({
    name: 'PiForm',
    component: PiForm,
    actions: ACTION_TYPES,
    events: {
      onValueChanged: ACTION_TYPES.VALUE_CHANGED,
      onFormSubmit: ACTION_TYPES.FORM_SUBMIT
    },
  });

  register.cardComponent({
    name: 'PiForm:RadioGroup',
    component: PiRadioGroupForm,
  });
}
