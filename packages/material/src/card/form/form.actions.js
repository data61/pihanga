import { registerActions } from '@pihanga/core';

const Domain = 'PI_FORM';
// export const ACTION_TYPES = {
//   FORM_SUBMIT: `${Domain}FORM_SUBMIT`,
//   VALUE_CHANGED: `${Domain}VALUE_CHANGED`,
// };
export const ACTION_TYPES = registerActions(Domain, ['FORM_SUBMIT', 'VALUE_CHANGED']);
