import { dispatch } from '@pihanga/core';

const Domain = 'NAV_DRAWER:';
export const ACTION_TYPES = {
  OPEN_DRAWER: `${Domain}OPEN_DRAWER`,
  CLOSE_DRAWER: `${Domain}CLOSE_DRAWER`,
  NAV_REQUEST: `${Domain}NAV_REQUEST`,
};

export function clickOpenDrawer(cardName) {
  dispatch({ type: ACTION_TYPES.OPEN_DRAWER, cardName });
}

export function clickCloseDrawer(cardName) {
  dispatch({ type: ACTION_TYPES.CLOSE_DRAWER, cardName });
}

export function clickNavMenu(component, cardName) {
  dispatch({ type: ACTION_TYPES.NAV_REQUEST, cardName, ...component });
}
