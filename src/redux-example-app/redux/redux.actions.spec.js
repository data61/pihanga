import { dispatch } from './store';
import { ACTION_TYPES, emitError } from './redux.actions';

jest.mock('./store', () => ({
  dispatch: jest.fn()
}));

describe('redux actions', () => {
  beforeEach(() => {
    dispatch.mockClear();
  });

  it('should dispatch correct event', () => {
    const msg = {};
    const stackInfo = {};

    emitError(msg, stackInfo);

    expect(dispatch).toHaveBeenCalledWith({
      type: ACTION_TYPES.ERROR,
      msg,
      stackInfo
    });
  });
});
