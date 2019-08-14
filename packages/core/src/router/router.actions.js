import { dispatch } from '../redux';

const Domain = 'ROUTER:';
export const ACTION_TYPES = {
  SHOW_PAGE: `${Domain}SHOW_PAGE`,
  NAVIGATE_TO_PAGE: `${Domain}NAVIGATE_TO_PAGE`,
};

export function navigateToPage(url, fromBrowser = false) {
  dispatch({
    type: ACTION_TYPES.NAVIGATE_TO_PAGE,
    url,
    fromBrowser,
  });
}
