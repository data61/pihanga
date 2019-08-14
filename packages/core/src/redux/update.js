import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import every from 'lodash/every';

function updateArray(sourceArray, id, leaf) {
  return sourceArray.map((el) => {
    if (el.id === undefined) {
      throw new Error(`Missing "id" key in ${el}`);
    }
    if (el.id !== id) return el;
    return Object.assign({}, el, leaf);
  });
}

//
// update({a:{b:{c: 1, d:2}}}, ['a','b'], {d:3})
//
export function update(source, path, leaf) {
  if (path.length === 0) {
    if (isFunction(leaf)) {
      return leaf(source);
    } else if (isArray(leaf)) {
      return leaf.slice();
    } else if (isObject(leaf)) {
      return Object.assign({}, source, leaf);
    } else {
      return leaf;
    }
  }

  // copy array with slice() to avoid side effect
  const pathClone = path.slice();
  const car = pathClone.shift();

  if (isArray(source)) {
    if (pathClone.length !== 0) {
      throw new Error('Can\'t handle updates of intermittent arrays');
    }
    return isFunction(leaf) ? leaf(source) : updateArray(source, car, leaf);
  }
  const h = {};

  // create a new object if the property does not exist
  const newSource = source[car] || {};

  h[car] = update(newSource, pathClone, leaf);
  return Object.assign({}, source, h);
}

/**
 * @param source An object, e.g {name: 'test', data: { param1: 'value' }}
 * @param path An array of the given object properties, e.g. ['data', 'param1']
 */
export function get(source, path) {
  let result = source;

  if (path && path.length > 0) {
    every(path, (propertyName) => {
      result = result[propertyName];

      // break loop when property name is not found
      return (result !== undefined);
    });
  }

  return result;
}
