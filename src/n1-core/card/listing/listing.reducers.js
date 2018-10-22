import { REDUX_ACTION_TYPES, update } from 'n1-core';

export default (registerReducer) => {
  registerReducer(REDUX_ACTION_TYPES.INIT, (state, action) => {
    if (state.datasets) {
      return state;
    }
    return update(state, ['datasets'], {
      listing: [],
      detail: {},
    });
  });
};