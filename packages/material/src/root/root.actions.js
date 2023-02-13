import { dispatch } from '@pihanga/core';
//import { navigateToPage as routerNavToPage } from 'n1-core/router';

const Domain = 'APP:';

export const ACTION_TYPES = {
  RELOAD_BACKEND: `${Domain}RELOAD_BACKEND`,
  CREATE_SCRATCH: `${Domain}CREATE_SCRATCH`,
};

export function reloadBackend() {
  dispatch({
    type: ACTION_TYPES.RELOAD_BACKEND,
  });
}

// export function navigateToPage(path) {
//   routerNavToPage(path);
// }

export function createScratch(path, initial = {}) {
  dispatch({
    type: ACTION_TYPES.CREATE_SCRATCH,
    path, initial
  });
}
