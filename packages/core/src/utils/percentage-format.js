/**
 * @param percentageValue Must be within [0,1]
 * @returns {string} Percentage value (e.g '5%')
 */
export function prettifyPercentage(percentageValue) {
  // Needs to do a rounding here to avoid issue with multiplying float numbers
  // in JS where 0.55 * 100 = 55.00000000000001, instead of 55
  return `${Math.round(percentageValue * 100)}%`;
}
