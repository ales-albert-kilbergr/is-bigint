import { Validator, ValidatorOptions } from 'class-validator';
import { isBigInt, IsBigInt } from './is-bigint';

function checkValidValues(
  object: { someProperty: any },
  values: any[],
  validatorOptions?: ValidatorOptions,
): Promise<any> {
  const validator = new Validator();
  const promises = values.map((value) => {
    object.someProperty = value;
    return validator.validate(object, validatorOptions).then((errors) => {
      expect(errors.length).toEqual(0);
      if (errors.length !== 0) {
        console.log(`Unexpected errors: ${JSON.stringify(errors)}`);
        throw new Error('Unexpected validation errors');
      }
    });
  });

  return Promise.all(promises);
}

function checkInvalidValues(
  object: { someProperty: any },
  values: any[],
  validatorOptions?: ValidatorOptions,
): Promise<any> {
  const validator = new Validator();
  const promises = values.map((value) => {
    object.someProperty = value;
    return validator
      .validate(object, validatorOptions)
      .then((errors) => {
        expect(errors.length).toEqual(1);
        if (errors.length !== 1) {
          throw new Error('Missing validation errors');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return Promise.all(promises);
}

function checkReturnedError(
  object: { someProperty: any },
  values: any[],
  validationType: string,
  message: string,
  validatorOptions?: ValidatorOptions,
): Promise<any> {
  const validator = new Validator();
  const promises = values.map((value) => {
    object.someProperty = value;
    return validator.validate(object, validatorOptions).then((errors) => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(object);
      expect(errors[0].property).toEqual('someProperty');
      expect(errors[0].constraints).toEqual({ [validationType]: message });
      expect(errors[0].value).toEqual(value);
    });
  });

  return Promise.all(promises);
}

describe('IsBigInt', () => {
  // By casting bigints via function instead of `2n` annotation we can avoid
  // to bump the typescript build target from es2018 to es2020
  const validValues = [BigInt(2), BigInt(4), BigInt(100), BigInt(1000)];
  const invalidValues = [
    '01',
    '-01',
    '000',
    '100e10',
    '123.123',
    '   ',
    '',
    10,
    2.5,
    -0.1,
  ];

  class MyClass {
    @IsBigInt()
    public someProperty!: string;
  }

  it('should not fail if validator.validate said that its valid', () => {
    return checkValidValues(new MyClass(), validValues);
  });

  it('should fail if validator.validate said that its invalid', () => {
    return checkInvalidValues(new MyClass(), invalidValues);
  });

  it('should not fail if method in validator said that its valid', () => {
    validValues.forEach((value) => expect(isBigInt(value)).toBeTruthy());
  });

  it('should fail if method in validator said that its invalid', () => {
    invalidValues.forEach((value) =>
      expect(isBigInt(value as any)).toBeFalsy(),
    );
  });

  it('should return error object with proper data', () => {
    const validationType = 'isBigInt';
    const message = 'someProperty must be a bigint number';
    return checkReturnedError(
      new MyClass(),
      invalidValues,
      validationType,
      message,
    );
  });
});
