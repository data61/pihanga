// import { vdatasetDetailService } from './vdataset/vdataset-detail';

/* eslint-disable max-len */
export const MOCK_VDS_FEATURES = [
  { id: 0, included: true, name: 'Travel date', datasetName: 'DBS:User Credit', type: 'date/day' },
  { id: 1, included: false, name: 'Address', datasetName: 'DBS:User Credit', type: 'address/street' },
  { id: 2, included: true, name: 'DOB', datasetName: 'DBS:User Credit', type: 'date/day', discretize: true },
  { id: 3, included: false, name: 'Credit rating', datasetName: 'DBS:User Credit', type: 'number' },
  { id: 4, included: false, name: 'Account balance', datasetName: 'DBS:User Credit', type: 'currency' },
  { id: 5, included: false, name: 'Mortgage', datasetName: 'DBS:User Credit', type: 'boolean' },
  { id: 6, included: false, name: 'Travel date', datasetName: 'Singtel:Foreign Calls', type: 'date/day' },
  { id: 7, included: false, name: 'Address', datasetName: 'Singtel:Foreign Calls', type: 'address/street' },
  { id: 8, included: false, name: 'DOB', datasetName: 'Singtel:Foreign Calls', type: 'date/day' },
  { id: 9, included: false, name: 'Flight per yer', datasetName: 'Singtel:Foreign Calls', type: 'number' },
  { id: 10, included: false, name: 'Travel cost', datasetName: 'Singtel:Foreign Calls', type: 'currency' },
  { id: 11, included: false, name: 'Flew past', datasetName: 'Singtel:Foreign Calls', type: 'boolean' },
];
/* eslint-enable max-len */

/**
 * This mock initial state is used when creating the mockups for project n experiment workflow.
 *
 * This file is not used at the moment. It is kept to remind us what is needed in front-end
 *
 * FIXME: Remove this file before demo
 */
export const initialState1 = {
  user: {},
  version: {},
  checkedSession: false,
  route: {
    path: '/overview',
    paramValueByName: {},
  },

  scratch: {}, // space for various components to store volatile state.
};
// Webpack unexpectedly complains that "exports" is undefined. See this github issue:
// https://github.com/webpack/webpack/issues/3974#issuecomment-301513533
//
// const ds = exports.initialState1.virtualDatasets.vds1;
// ds.features =
//   vdatasetDetailService.getFeatures(ds.sources, exports.initialState1.datasetCatalog);
// ds.features[0].included = true;
// ds.features[2].included = true;
// ds.features[2].discretize = true;

export const initialState2 = {
  left: {
    width: 0.4,
    widgets: [],
  },
  right: {
    width: 0.6,
    widgets: [],
  },
  resources: {},
  data: {},
  services: {},

  window: {
    height: window.innerHeight,
    width: window.innerWidth,
  },

};
