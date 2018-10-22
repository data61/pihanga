import { INPUT_TYPE, isEmpty, INPUT_VALUE_VALIDATORS, INPUT_VALUE_PARSERS } from './input-type';

jest.mock('../logger', () => ({
  createLogger: jest.fn(() => {
    return {
      warn: jest.fn()
    };
  }),
}));

const CHECK_CONFIG = { times: 50 };
const isNotNumber = x => typeof x === 'object' || typeof x === 'boolean' || x === ''
  || isNaN(x);


describe('Input', () => {
  describe('parsers', () => {
    check.it('should return a dummy parser if it can\'t find the given one', CHECK_CONFIG, gen.any,
      x => {
        const parser = INPUT_VALUE_PARSERS['something_not_existed'];
        expect(parser(x)).toBe(x);
      });

    check.it('should correctly return a string', CHECK_CONFIG, gen.any, x => {
      const parser = INPUT_VALUE_PARSERS[INPUT_TYPE.STRING];
      expect(parser(x)).toBe(`${x}`);
    });

    check.it('should correctly return a number for numeric value', CHECK_CONFIG, gen.any, x => {
      const parser = INPUT_VALUE_PARSERS[INPUT_TYPE.NUMBER];
      if (isNotNumber(x)) {
        expect(parser(x)).toBeUndefined();
      } else {
        expect(parser(x)).toEqual(Number(x));
      }
    });

    describe('boolean', () => {
      const parser = INPUT_VALUE_PARSERS[INPUT_TYPE.BOOLEAN];

      check.it('should correctly return a boolean', CHECK_CONFIG, gen.boolean, x => {
        const commonCheck = result => result === x;

        expect(commonCheck(parser(`${x}`))).toBeTruthy();
        expect(commonCheck(parser(x))).toBeTruthy();
      });

      check.it('should deal with non-boolean value',
        gen.oneOf([ gen.number, gen.undefined, gen.string ]),
        x => {
          if (x === undefined) {
            expect(parser(x)).toBeUndefined();
          } else {
            expect(parser(x)).toEqual(true);
          }
        });
    });

    check.it('should correctly return an integer', CHECK_CONFIG, gen.any, x => {
      const parser = INPUT_VALUE_PARSERS[INPUT_TYPE.INTEGER];

      if (isNotNumber(x)) {
        expect(parser(x)).toBeUndefined();
      } else {
        expect(parser(x)).toEqual(Math.round(x));
      }
    });
  });

  describe('validators', () => {
    check.it('should return an empty validator if it can\'t find the given one', CHECK_CONFIG,
      gen.any,
      x => {
        const validator = INPUT_VALUE_VALIDATORS['something_not_existed']();
        expect(validator(x)).toBe(false);
      });

    check.it('should correctly validate "required" rule',
      CHECK_CONFIG,
      gen.any,
      x => {
        const requiredValidator = INPUT_VALUE_VALIDATORS.required(true);
        const nonRequiredValidator = INPUT_VALUE_VALIDATORS.required(false);

        if (isEmpty(x)) {
          expect(requiredValidator(x)).toBeTruthy();
          expect(nonRequiredValidator(x)).toBeFalsy();
        } else {
          expect(requiredValidator(x)).toBeFalsy();
        }
      });

    check.it('should correctly validate "min" rule',
      CHECK_CONFIG,
      gen.any, gen.any,
      (minValue, x) => {
        const validator = INPUT_VALUE_VALIDATORS.min(minValue);

        if (isEmpty(minValue) || isEmpty(x) || isNotNumber(minValue) || isNotNumber(x)
          || x >= minValue) {
          expect(validator(x)).toBeFalsy();
        } else {
          expect(validator(x)).toBeTruthy();
        }
      });

    it('should correctly validate "min" rule',
      () => {
        const minValue = [0];
        const validator = INPUT_VALUE_VALIDATORS.min(minValue);
        const x = [[]];
        if (isEmpty(minValue) || isEmpty(x) || isNotNumber(Number(minValue)) || isNotNumber(x)
          || x >= minValue) {
          expect(validator(x)).toBeFalsy();
        } else {
          expect(validator(x)).toBeTruthy();
        }
      });

    check.it('should correctly validate "max" rule',
      CHECK_CONFIG,
      gen.any, gen.any,
      (maxValue, x) => {
        const validator = INPUT_VALUE_VALIDATORS.max(maxValue);

        if (isEmpty(maxValue) || isEmpty(x) || isNotNumber(maxValue) || isNotNumber(x)
          || x <= maxValue) {
          expect(validator(x)).toBeFalsy();
        } else {
          expect(validator(x)).toBeTruthy();
        }
      });

    check.it('should correctly validate "maximumLength" rule',
      CHECK_CONFIG,
      gen.any, gen.any,
      (maxLength, x) => {
        const validator = INPUT_VALUE_VALIDATORS.maximumLength(maxLength);

        if (isEmpty(maxLength) || isEmpty(x) || isNotNumber(maxLength)
          || `${x}`.length <= maxLength) {
          expect(validator(x)).toBeFalsy();
        } else {
          expect(validator(x)).toBeTruthy();
        }
      });

    check.it('should correctly validate "string" rule',
      CHECK_CONFIG,
      gen.any,
       x => {
        const validator = INPUT_VALUE_VALIDATORS[INPUT_TYPE.STRING]();

        if (isEmpty(x) || typeof x === 'string') {
          expect(validator(x)).toBeFalsy();
        } else {
          expect(validator(x)).toBeTruthy();
        }
      });

    describe('number', () => {
      const validator = INPUT_VALUE_VALIDATORS[INPUT_TYPE.NUMBER]();

      check.it('should correctly validate number value',
        CHECK_CONFIG,
        gen.oneOf([
          gen.number.suchThat(n => !isNaN(n)),
          '',
          gen.undefined,
          [],
          {},
        ]),
        x => expect(validator(x)).toBeFalsy());

      check.it('should correctly validate non-number value',
        CHECK_CONFIG,
        gen.oneOf([
          gen.array,
          gen.boolean,
          gen.string.suchThat(n => n !== '' && isNaN(Number(n))),
        ]),
        x => expect(validator(x)).toBeTruthy());
    });

    describe('boolean', () => {
      const validator = INPUT_VALUE_VALIDATORS[INPUT_TYPE.BOOLEAN]();

      check.it('should correctly validate boolean value',
        CHECK_CONFIG,
        gen.oneOf([
          'true',
          'false',
          gen.boolean,
          '',
          gen.undefined,
          [],
          {},
        ]),
        x => expect(validator(x)).toBeFalsy());

      check.it('should correctly validate non-boolean value',
        CHECK_CONFIG,
        gen.oneOf([
          gen.number,
          gen.array,
          gen.string.suchThat(n => n !== '' && isNaN(Number(n))),
        ]),
        x => expect(validator(x)).toBeTruthy());
    });

    describe('integer', () => {
      const validator = INPUT_VALUE_VALIDATORS[INPUT_TYPE.INTEGER]();

      check.it('should correctly validate integer value',
        CHECK_CONFIG,
        gen.oneOf([
          gen.int,
          '',
          gen.undefined,
          [],
          {},
        ]),
        x => expect(validator(x)).toBeFalsy());

      check.it('should correctly validate non-integer value',
        CHECK_CONFIG,
        gen.oneOf([
          -0.2, 0.2,
          gen.boolean,
          gen.string.suchThat(n => n !== '' && isNaN(Number(n))),
        ]),
        x => expect(validator(x)).toBeTruthy());
    });
  });
});
