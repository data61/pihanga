export * from './array';
export * from './percentage-format';
export * from './time';
export * from './indeterminable-data';
export * from './number';
export * from './pi-prop-types'

export function exportModule(hash, m) {
  if (hash) {
    for (var k of Object.keys(m)) {
      hash[k] = m[k];
    }
  }
  return hash;
}
