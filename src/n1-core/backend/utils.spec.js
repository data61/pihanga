import { arrayToDict } from './utils';

describe('arrayToDict()', () => {
  it('should convert list of items to a dictionary correctly', () => {
    const testArray = [
      {
        id: 1,
        value: 11,
      }, {
        id: 2,
        value: 22,
      },
    ];

    expect(arrayToDict(testArray, 'id')).toEqual({
      '1': {
        id: 1,
        value: 11,
      },
      '2': {
        id: 2,
        value: 22,
      },
    });
  });
});
