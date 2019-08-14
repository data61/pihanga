import moment from 'moment';
import { renderTime, humaniseDuration } from './time';

describe('Time', () => {
  describe('renderTime()', () => {
    it('should return the approximate time difference', () => {
      expect(renderTime(undefined)).toEqual('');
      expect(renderTime(moment())).toEqual('a few seconds ago');

      let tempDate = new Date();
      tempDate.setDate(tempDate.getDate() - 1);
      expect(renderTime(moment(tempDate))).toEqual('a day ago');
    });
  });

  describe('humaniseDuration()', () => {
    it('should return the exact time difference', () => {
      expect(humaniseDuration(1, 'm')).toEqual('1 minute');
      expect(humaniseDuration(59, 'm')).toEqual('59 minutes');
      expect(humaniseDuration(62, 'm')).toEqual('1 hour and 2 minutes');
      expect(humaniseDuration(500, 'ms')).toEqual('0.5 seconds');
    });
  });
});
