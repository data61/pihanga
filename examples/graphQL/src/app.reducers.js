import { actions, update } from '@pihanga/core';

export function init(register) {
  register.reducer(actions('PiForm').VALUE_CHANGED, (state, a) => {
    if (a.id === 'search' && a.fieldID === 'type') {
      const s2 = update(state, ['form', 'type'], a.value);
      // clear name field
      const s3 = update(s2, ['pihanga', 'search', 'values', 'name'], '');
      // clear graph
      return update(s3, ['graph'], {nodes: [], links: []});
    } else {
      return state;
    }
  });
}