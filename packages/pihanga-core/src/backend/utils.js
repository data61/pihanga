import reduce from 'lodash/reduce';

/**
 * Convert an array list of items to a dictionary type
 *
 * NOTE: each item must have a field called "id")
 * @param array
 * @param idFieldName
 */
export function arrayToDict(array, idFieldName) {
  return reduce(array, (itemDict, item) => {
    const tmp = itemDict;
    tmp[item[idFieldName]] = item;
    return tmp;
  }, {});
}
