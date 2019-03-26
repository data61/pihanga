"use strict";

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
}); //console.log(l);

l.forEach(function (e) {
  return console.log(e);
}); // console.log('export default {');
// Object.keys(gex).forEach(k => {
//   console.log('  ' + k + ': ' + gex[k] + ',');
// });
// console.log('}');