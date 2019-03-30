"use strict";

/**
 * A simple script which extracts all the exported functions from this
 * library and presents them in a detailed manner allowing rollup to
 * discover them - export * from ... does not work.
 * 
 * Usage: node src/create_index.js
 */
var dirs = ['logger', 'redux', 'router', 'utils', 'start', 'card.service'];
var gex = {};
var l = [];
dirs.forEach(function (d) {
  l.push('export {');

  var ex = require('../lib/' + d);

  Object.keys(ex).forEach(function (f) {
    if (!f.startsWith('_')) {
      l.push('  ' + f + ',');
    }
  });
  l.push('} from \'./' + d + '\'\n');
});
l.forEach(function (e) {
  return console.log(e);
});