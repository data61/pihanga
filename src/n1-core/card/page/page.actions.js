import { dispatch } from 'n1-core';

import { navigateToPage } from 'n1-core/app';

const Domain = 'PAGE:';
export const ACTION_TYPES = {
  NAVIGATE_TO: `${Domain}NAVIGATE_TO`,
  REFRESH_CONTENT: `${Domain}REFRESH_CONTENT`,
  OPEN_DRAWER: `${Domain}OPEN_DRAWER`,
  CLOSE_DRAWER: `${Domain}CLOSE_DRAWER`,
  
  TOGGLE_USER_MENU: `${Domain}TOGGLE_USER_MENU`,
  TOGGLE_VERSION_INFO: `${Domain}TOGGLE_VERSION_INFO`,
  CLICK_TOP_NAV_BAR: `${Domain}CLICK_TOP_NAV_BAR`,
};

export function clickNavMenu(component) {
  navigateToPage(component.path);
}

export function clickOpenDrawer(cardName) {
  dispatch({ type: ACTION_TYPES.OPEN_DRAWER, cardName });
}

export function clickCloseDrawer(cardName) {
  dispatch({ type: ACTION_TYPES.CLOSE_DRAWER, cardName });
}

export function refreshContent(pageType) {
  dispatch({ 
    type: ACTION_TYPES.REFRESH_CONTENT, 
    pageType,
  });
}
