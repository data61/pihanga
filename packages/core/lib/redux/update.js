"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.update = update;
exports.get = get;

var _isArray = _interopRequireDefault(require("lodash/isArray"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

var _isObject = _interopRequireDefault(require("lodash/isObject"));

var _every = _interopRequireDefault(require("lodash/every"));

function updateArray(sourceArray, id, leaf) {
  return sourceArray.map(function (el) {
    if (el.id === undefined) {
      throw new Error("Missing \"id\" key in " + el);
    }

    if (el.id !== id) return el;
    return Object.assign({}, el, leaf);
  });
} //
// update({a:{b:{c: 1, d:2}}}, ['a','b'], {d:3})
//


function update(source, path, leaf) {
  if (path.length === 0) {
    if ((0, _isFunction.default)(leaf)) {
      return leaf(source);
    } else if ((0, _isArray.default)(leaf)) {
      return leaf.slice();
    } else if ((0, _isObject.default)(leaf)) {
      return Object.assign({}, source, leaf);
    } else {
      return leaf;
    }
  } // copy array with slice() to avoid side effect


  var pathClone = path.slice();
  var car = pathClone.shift();

  if ((0, _isArray.default)(source)) {
    if (pathClone.length !== 0) {
      throw new Error('Can\'t handle updates of intermittent arrays');
    }

    return (0, _isFunction.default)(leaf) ? leaf(source) : updateArray(source, car, leaf);
  }

  var h = {}; // create a new object if the property does not exist

  var newSource = source[car] || {};
  h[car] = update(newSource, pathClone, leaf);
  return Object.assign({}, source, h);
}
/**
 * @param source An object, e.g {name: 'test', data: { param1: 'value' }}
 * @param path An array of the given object properties, e.g. ['data', 'param1']
 */


function get(source, path) {
  var result = source;

  if (path && path.length > 0) {
    (0, _every.default)(path, function (propertyName) {
      result = result[propertyName]; // break loop when property name is not found

      return result !== undefined;
    });
  }

  return result;
}