import { dispatch, registerActions } from '../redux';

export const ACTION_TYPES = registerActions('ROUTER', ['SHOW_PAGE', 'NAVIGATE_TO_PAGE']);

export function navigateToPage(url, fromBrowser = false) {
  dispatch({
    type: ACTION_TYPES.NAVIGATE_TO_PAGE,
    url,
    fromBrowser,
  });
}
