import { dispatch } from 'n1-core';

const Domain = 'BACKEND:';

export const ACTION_TYPES = {
  THROW_UNAUTHORISED_ERROR: `${Domain}THROW_UNAUTHORISED_ERROR`,
  THROW_PERMISSION_DENIED_ERROR: `${Domain}THROW_PERMISSION_DENIED_ERROR`,
};

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
