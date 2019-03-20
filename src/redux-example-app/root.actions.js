import { dispatch } from 'redux-example-app/redux';

const Domain = 'ROOT:';

export const ACTION_TYPES = {
  UPDATE_ROUTE: `${Domain}UPDATE_ROUTE`
};

export function updateRoute({ path, payload, preventAddingHistory }) {
  dispatch({
    type: ACTION_TYPES.UPDATE_ROUTE,
    path,
    payload,
    preventAddingHistory
  });
}
