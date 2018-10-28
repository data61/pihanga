function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export const initialState = {
  user: {},
  version: {},
  checkedSession: true,
  route: {
    path: '/cars',
    //paramValueByName: {},
    routePath: '???',
  },

  trucks: {
    topLevel: true,
    path: '/trucks',
    list: [{
        id: 1,
        name: '1979 Chevrolet LUV',
        bodyStyle: 'Truck',
        model: 'Chevrolet LUV',
        year: 1979,
      }, {
        id: 2,
        name: '1989 Toyota Truck Xtracab SR5',
        bodyStyle: 'Truck',
        model: 'Toyota Truck Xtracab SR5',
        year: 1989,
      }, {
        id: 3,
        name: '1994 Dodge Ram',
        bodyStyle: 'Truck',
        model: 'Dodge Ram',
        year: 1994,
      },
    ],
  },

  cars: {
    topLevel: true,
    path: '/cars',
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
  },

  // FIXME: Save this data when session is about to time out OR user accidentally exits a workflow
  unsavedData: {}, // space for various unsaved/unfinished workflow

  // FIXME: Shouldn't be necessary anymore as we have separate card entries
  // scratch: {
  //   table: {
  //     // carListing: {

  //     // }
  //   }
  // },

  pihanga: {}
};
