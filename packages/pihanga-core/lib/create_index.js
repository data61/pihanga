"use strict";

var dirs = ['logger', 'redux', 'router', 'utils', 'start', 'card.service'];
var gex = {};
dirs.forEach(function (d) {
  var dn = d.replace('.', '_').toUpperCase();
  console.log('import * as ' + dn + ' from \'./' + d);

  var ex = require('../lib/' + d);

  Object.keys(ex).forEach(function (f) {
    if (!f.startsWith('_')) {
      gex[f] = dn + '.' + f;
    }
  });
});
console.log('export default {');
Object.keys(gex).forEach(function (k) {
  console.log('  ' + k + ': ' + gex[k] + ',');
});
console.log('}');