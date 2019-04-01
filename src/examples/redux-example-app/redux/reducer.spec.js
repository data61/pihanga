import { emitError } from './redux.actions';
import { Reducer } from './reducer';

jest.mock('pihanga', () => ({
  LoggerFactory: {
    create: jest.fn(() => ({
      infoSilently: jest.fn(),
      debugSilently: jest.fn(),
      error: jest.fn()
    }))
  }
}));

jest.mock('./redux.actions', () => ({
  ACTION_TYPES: {},
  emitError: jest.fn()
}));

jest.useFakeTimers();

describe('reducer', () => {
  describe('registerReducer()', () => {
    it('should chain reducers by action types', () => {
      const reducer = new Reducer({});
      const actionType = 'DO_SOMETHING';
      reducer.registerReducer(actionType, () => {});
      reducer.registerReducer(actionType, () => {});
      expect(reducer.reducerByAction[actionType].length).toBe(2);
    });

    it('should throw an error if type is undefined', () => {
      const reducer = new Reducer({});

      expect.assertions(1);
      try {
        reducer.registerReducer(undefined, () => {});
      } catch (e) {
        expect(e).not.toBeUndefined();
      }
    });
  });

  describe('rootReducer()', () => {
    afterEach(() => {
      setTimeout.mockReset();
    });

    it('should dispatch an error if there is any exception in the reducer', () => {
      const reducer = new Reducer({
        DO_SOMETHING: [
          () => {
            throw Exception('test exception');
          }
        ]
      });

      reducer.rootReducer({}, { type: 'DO_SOMETHING' });
      expect(setTimeout).toHaveBeenCalledTimes(1);

      jest.runAllTimers();
      expect(emitError).toHaveBeenCalledTimes(1);
    });

    it('should dispatch an error if the result of a reducer is not a plain object', () => {
      const reducer = new Reducer({
        DO_SOMETHING: [() => []]
      });

      reducer.rootReducer({}, { type: 'DO_SOMETHING' });
      expect(setTimeout).toHaveBeenCalledTimes(1);

      jest.runAllTimers();
      expect(emitError).toHaveBeenCalledTimes(1);
    });

    it('should preserve the state if no reducer exists', () => {
      const reducer = new Reducer({
        DO_SOMETHING: [
          () => {
            throw Exception('test exception');
          }
        ]
      });

      const beforeState = {};
      const afterState = reducer.rootReducer(beforeState, { type: 'DO_SOMETHING_ELSE' });

      expect(beforeState).toEqual(afterState);
    });
  });
});
