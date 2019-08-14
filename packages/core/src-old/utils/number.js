import numeral from 'numeral';

/**
 * Get an Integer randomiser for a given range
 * @param min
 * @param max
 * @returns {function()}
 */
export function getIntegerNumberRandomiser(min, max) {
  let rangeMin = min;
  let rangeMax = max;

  if (rangeMin === undefined) {
    rangeMin = Number.MIN_VALUE;
  }

  if (rangeMax === undefined) {
    rangeMax = Number.MAX_VALUE;
  }

  // in case a wrong order is given
  if (rangeMax < rangeMin) {
    const tmp = rangeMin;
    rangeMin = rangeMax;
    rangeMax = tmp;
  }

  return () => Math.floor(Math.random() * (1 + (rangeMax - rangeMin))) + rangeMin;
}

/**
 * Prettify a number
 *
 * Examples:
 *  prettifyNumber(100000);           // '100,000'
 *  prettifyNumber(123456789);        // '123,456,789'
 *  prettifyNumber(123456789.1234);   // '123,456,789.12'
 *  prettifyNumber(-123456789.1234);  // '-123,456,789.12'
 *
 * @param number
 */
export function prettifyNumber(number) {
  if (number === undefined) return undefined;

  const COMMON_NUMBER_FORMAT = '0,0.[0000]';
  return numeral(number).format(COMMON_NUMBER_FORMAT);
}
