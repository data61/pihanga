import { getIntegerNumberRandomiser, prettifyNumber } from './number';

describe('Utils: Number', () => {
  describe('getIntegerNumberRandomiser()', () => {
    it('should randomise a number within the given range', () => {
      const testRandomNumber = getIntegerNumberRandomiser(0,1)();
      expect(testRandomNumber >= 0 && testRandomNumber <= 1).toBeTruthy();
    });

    it('should randomise a number within the given range even if the range is given in a wrong' +
      ' order', () => {
      const testRandomNumber = getIntegerNumberRandomiser(1,0)();
      expect(testRandomNumber >= 0 && testRandomNumber <= 1).toBeTruthy();
    });

    it('should deal with undefined range', () => {
      let testRandomNumber = getIntegerNumberRandomiser(undefined,0)();
      expect(testRandomNumber !== undefined).toBeTruthy();

      testRandomNumber = getIntegerNumberRandomiser(undefined,undefined)();
      expect(testRandomNumber !== undefined).toBeTruthy();

      testRandomNumber = getIntegerNumberRandomiser(0,undefined)();
      expect(testRandomNumber !== undefined).toBeTruthy();
    });
  });

  describe('prettifyNumber()', () => {
    it('should prettify a number correctly', () => {
      expect(prettifyNumber(100000)).toEqual('100,000');
      expect(prettifyNumber(123456789)).toEqual('123,456,789');
      expect(prettifyNumber(123456789.123406)).toEqual('123,456,789.1234');
      expect(prettifyNumber(-123456789.123456)).toEqual('-123,456,789.1235');
    });

    it('should deal with undefined number', () => {
      expect(prettifyNumber(undefined)).toEqual(undefined);
    });
  });
});
