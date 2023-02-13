/**
 * Sort the given array by the given key of every item in the array
 * @param arrays
 * @param key
 * @param descendingOrder
 */
export function sortBy(arrays, key, descendingOrder) {
  return arrays.sort((p1, p2) => {
    const compareValue = p1[key].localeCompare(p2[key]);
    return (descendingOrder ? -compareValue : compareValue);
  });
}
