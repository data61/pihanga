import { useState } from 'react';
import {
  schemeCategory10, schemeAccent, schemeDark2,
  schemePaired,
  schemePastel1, schemePastel2,
  schemeSet1, schemeSet2, schemeSet3,
  schemeTableau10,  
} from 'd3-scale-chromatic';
import { createLogger } from '@pihanga/core';

const logger = createLogger('useColorScheme');

// https://github.com/d3/d3-scale-chromatic
const colorSchemes = {
  'category10': schemeCategory10,
  'accent': schemeAccent,
  'dark2': schemeDark2,
  'paired': schemePaired,
  'pastel1': schemePastel1,
  'pastel2': schemePastel2,
  'set1': schemeSet1,
  'set2': schemeSet2,
  'set3': schemeSet3,
  'tableau10': schemeTableau10,
};
export const defColorScheme = Object.keys(colorSchemes)[0];

function getColorScheme(name) {
  let s = colorSchemes[name];
  if (!s) {
    logger.warn(`Unknown color scheme '${name}', defaulting to '${defColorScheme}'`);
    s = colorSchemes[defColorScheme];
  }
  return s;
}

/**
 * Returns a function which maps a type identifier to a color from the color scheme
 * identified by 'colorScheme'. Mutiple calls to the function with the same type identifier 
 * will return the same color. However, if the number of different type identifiers exceeds 
 * the number of colors in the color scheme, colors are going to be recycled.
 * 
 * Providing an optional array of expected types ensures that the color assignments are
 * the same across different contexts.
 *  
 * @param {string} colorScheme Name of color scheme 
 * @param {[object]} preTypes Array of perdefined types to fix order of color assignments
 */
export default function useColorScheme(colorScheme = defColorScheme, preTypes = []) {
  const [colors] = useState(() => getColorScheme(colorScheme));
  const [type2Color] = useState(() => {
    const t2c = {};
    preTypes.forEach((type, i) => {
      t2c[type] = colors[i % colors.length];
    });  
    return t2c;
  });

  return (type, defColor) => {
    if (type) {
      let color = type2Color[type];
      if (!color) {
        const cid = Object.keys(type2Color).length % colors.length;
        color = type2Color[type] = colors[cid]
      }
      return color;
    } else {
      return defColor;
    }
  }
}
