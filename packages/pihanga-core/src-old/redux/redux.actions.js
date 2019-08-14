import { dispatch } from './store';

const Domain = 'REDUX:';

export const ACTION_TYPES = {
  // internal redux action
  INIT: '@@INIT',

  ERROR: `${Domain}ERROR`,
};

export function emitError(msg, stackInfo) {
  dispatch({ type: ACTION_TYPES.ERROR, msg, stackInfo });
}
