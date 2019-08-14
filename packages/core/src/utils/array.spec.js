import { sortBy } from './array';

function isArraySorted(a, key, descendingOrder) {
  if (a.length <= 1) {
    return;
  }

  for (let i = 1; i < a.length; i++) {
    const compareValue = a[i][key].localeCompare(a[i - 1][key]);
    if (!descendingOrder && compareValue < 0) {
      fail(`${a[i]} should be placed before ${a[i - 1]}`);
    } else if (descendingOrder && compareValue > 0) {
      fail(`${a[i]} should be placed after ${a[i - 1]}`);
    }
  }
}

describe('array', () => {
  const mockItemKey = 'key';
  check.it('should sort the list of data correctly',
    { times: 50 },
    gen.array(gen.object({ [mockItemKey]: gen.char })),
    x => {
      isArraySorted(sortBy(x, mockItemKey), mockItemKey);
      isArraySorted(sortBy(x, mockItemKey, true), mockItemKey, true);
    });
});
