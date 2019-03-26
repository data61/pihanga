/**
 * A simple script which extracts all the exported functions from this
 * library and presents them in a detailed manner allowing rollup to
 * discover them - export * from ... does not work.
 * 
 * Usage: node src/create_index.js
 */
const dirs = [
  'logger', 'redux', 'router', 
  'utils', 'start', 'card.service'
];

const gex = {};
const l = [];
dirs.forEach(d => {
  l.push('export {');
  const ex = require('../lib/' + d);
  Object.keys(ex).forEach(f => {
    if (!f.startsWith('_')) {
      l.push('  ' + f + ',');
    }
  })
  l.push('} from \'./' + d + '\'\n');
})

l.forEach(e => console.log(e))
