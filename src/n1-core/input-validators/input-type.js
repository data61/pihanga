import { createLogger } from '../logger';

const logger = createLogger('InputValidators');

export const INPUT_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  INTEGER: 'integer',
};

/**
 *
 * @param value
 * @returns {*} 'undefined' if value is not a number, otherwise the number value of of the input
 */
function parseNumber(value) {
  const resultNumber = Number(value);

  // Override the default JS behavior of evaluating [] or boolean value as valid number
  return (typeof value === 'object' || typeof value === 'boolean' || value === ''
    || isNaN(resultNumber) ? undefined : resultNumber);
}

/**
 * This is used to parse any value to given type of that value
 *
 * Example: If a string value of "2.0" is fed to a number parser, it will return the number 2.0
 * @type {Proxy}
 */
export const INPUT_VALUE_PARSERS = new Proxy({
  [INPUT_TYPE.STRING]: value => (value !== undefined ? `${value}` : value),
  [INPUT_TYPE.NUMBER]: value => parseNumber(value),
  [INPUT_TYPE.BOOLEAN]: (value) => {
    if (value === undefined) {
      return value;
    }

    const lowerCaseValue = `${value}`.toLowerCase();
    return lowerCaseValue === 'true' || lowerCaseValue !== 'false';
  },
  [INPUT_TYPE.INTEGER]: (value) => {
    const number = parseNumber(value);
    if (number !== undefined) {
      return Math.round(number);
    }

    return undefined;
  },
}, {
  get: (target, name) => {
    if (!(name in target)) {
      logger.warn('The system doesn\'t have a parser for:', name);
      return value => value;
    }

    return target[name];
  },
});

/**
 * @param value true if the given value is empty
 */
export const isEmpty = value => value === undefined
  // eslint-disable-next-line no-null/no-null
  || value === null
  || value === ''
  || (typeof value === 'object' && Object.keys(value || {}).length === 0);

/**
 * Validators are of type: (optionalConfig) => (value) => ("error message" or false)
 *
 * Each validators takes in a custom config, which might not be required.
 * It returns one of these following values:
 * - false: if value is valid OR ignored
 * - A string: if value is invalid, and this is the error message
 *
 * @type {{required, min, max, maximumLength, string, number, positive_number, integer}}
 */
export const INPUT_VALUE_VALIDATORS = (() => {
  const ignoreEmpty = value => !isEmpty(value);
  const isNumber = value => !isNaN(INPUT_VALUE_PARSERS[INPUT_TYPE.NUMBER](value));

  return new Proxy({
    required: required => value => required && !ignoreEmpty(value) && 'This field is required',

    // Ignore if it is empty or not a number
    min: min => value =>
      ignoreEmpty(min) && isNumber(min)
      && ignoreEmpty(value) && isNumber(value)
      && value < min && `This field must be greater than or equal to ${min}`,

    max: max => value =>
      ignoreEmpty(max) && isNumber(max)
      && ignoreEmpty(value) && isNumber(value)
      && value > max && `This field must be less than or equal to ${max}`,

    maximumLength: maxLength => value =>
      ignoreEmpty(maxLength) && isNumber(maxLength)
      && ignoreEmpty(value)
      && `${value}`.length > maxLength
      && `This field must have no more than ${maxLength} characters`,

    [INPUT_TYPE.STRING]: () => value => ignoreEmpty(value)
      && typeof value !== 'string' && 'This field must be a string',

    [INPUT_TYPE.NUMBER]: () => value => ignoreEmpty(value)
      && !isNumber(value)
      && 'This field must be a number',

    [INPUT_TYPE.BOOLEAN]: () => value => ignoreEmpty(value)
      && ['true', 'false'].indexOf(`${value}`.toLowerCase()) < 0
      && 'This field must be "true" or "false"',

    [INPUT_TYPE.INTEGER]: () => value => ignoreEmpty(value)
      && !(/^[-]?[0-9]+$/.test(`${value}`))
      && 'This field must be an integer',
  }, {
    get: (target, name) => {
      if (!(name in target)) {
        logger.warn('The system doesn\'t have a validator for:', name);
        // returns an empty validator that is always valid
        return () => () => false;
      }

      return target[name];
    },
  });
})();
