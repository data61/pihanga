import { dispatch, registerActions } from '../redux';

const Domain = 'REST';
export const ACTION_TYPES = registerActions(Domain,
  [
    'THROW_UNAUTHORISED_ERROR', 'THROW_PERMISSION_DENIED_ERROR',
    'GET_SUBMITTED', 'GET_RESULT', 'GET_ERROR',
    'GET_PERIODIC_TICK',
  ]);

export function throwUnauthorisedError() {
  dispatch({
    type: ACTION_TYPES.THROW_UNAUTHORISED_ERROR,
  });
}

export function throwPermissionDeniedError() {
  dispatch({
    type: ACTION_TYPES.THROW_PERMISSION_DENIED_ERROR,
  });
}
