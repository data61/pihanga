
const dirs = [
  'logger', 'redux', 'router', 
  'utils', 'start', 'card.service'
];

const gex = {};

dirs.forEach(d => {
  const dn = d.replace('.', '_').toUpperCase();
  console.log('import * as ' + dn + ' from \'./' + d + '\'');
  const ex = require('../lib/' + d);
  Object.keys(ex).forEach(f => {
    if (!f.startsWith('_')) {
      gex[f] = dn + '.' + f
    }
  })
})

console.log('export default {');
Object.keys(gex).forEach(k => {
  console.log('  ' + k + ': ' + gex[k] + ',');
});
console.log('}');