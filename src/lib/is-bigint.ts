import { ValidationOptions, buildMessage, ValidateBy } from 'class-validator';

export const IS_BIGINT = 'isBigInt';

/**
 * Checks if the value is a bigint
 */
export function isBigInt(val: unknown): val is bigint {
  return typeof val === 'bigint';
}

/**
 * Checks if the value is a bigint
 */
export function IsBigInt(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_BIGINT,
      validator: {
        validate: (value): boolean => isBigInt(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a bigint number',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
