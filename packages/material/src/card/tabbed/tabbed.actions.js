import { dispatch } from '@pihanga/core';

const Domain = 'TABBED_CARD:';
export const ACTION_TYPES = {
  TAB_SELECTED: `${Domain}TAB_SELECTED`,
};

export function onTabSelected(cardName, tabId) {
  dispatch({ type: ACTION_TYPES.TAB_SELECTED, cardName, tabId });
}

