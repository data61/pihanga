import { prettifyPercentage } from './percentage-format';

describe('Utils: Percentage format', () => {
  describe('prettifyPercentage()', () => {
    it('should prettify a percentage value correctly', () => {
      expect(prettifyPercentage(0.55)).toEqual('55%');
      expect(prettifyPercentage(1)).toEqual('100%');
      expect(prettifyPercentage(0)).toEqual('0%');
      expect(prettifyPercentage(-0.5)).toEqual('-50%');
    });
  });
});
