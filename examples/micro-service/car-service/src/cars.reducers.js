import { update } from '@pihanga/core';

const DEF_STATE = {
  list: [{
      id: 1,
      name: 'Audi A4',
      bodyStyle: 'Car',
      model: 'Audi A4',
      year: 2016,
    }, {
      id: 2,
      name: 'Nissan 370Z',
      bodyStyle: 'Car',
      model: 'Nissan 370Z',
      year: 2015,
    }, {
      id: 3,
      name: 'Chevrolet Camaro',
      bodyStyle: 'Car',
      model: 'Chevrolet Camaro',
      year: 1965,
    },
  ],
};

export default (registerReducer) => {

  registerReducer('@@INIT', (state, action) => {
    if (state.cars) {
      return state; // already initialised
    }
    return update(state, ['cars'], DEF_STATE);
  });
}
