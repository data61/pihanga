import { doActionInReducer } from './store';

describe('store', () => {
  describe('doActionInReducer()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should execute the given function with the given arguments', () => {
      const mockFn = jest.fn();
      const mockArgs = [1, {}];
      const beforeState = {};

      const afterState = doActionInReducer(mockFn, mockArgs)(beforeState);
      expect(afterState).toEqual(beforeState);

      jest.runAllTimers();
      expect(setTimeout).toHaveBeenCalledTimes(1);

      expect(mockFn).toHaveBeenCalledWith(...mockArgs);
    });

    it('should execute the given function without any arguments', () => {
      const mockFn = jest.fn();
      const beforeState = {};

      const afterState = doActionInReducer(mockFn)(beforeState);
      expect(afterState).toEqual(beforeState);

      jest.runAllTimers();
      expect(setTimeout).toHaveBeenCalledTimes(1);

      expect(mockFn).toHaveBeenCalled();
    });
  });
});
