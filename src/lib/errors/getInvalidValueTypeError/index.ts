type Args = {
  value: unknown;
  expectedType?: string;
  expectedTypes?: string[];
};

export function getInvalidValueTypeError(args: Omit<Args, 'expectedType'>): string;
export function getInvalidValueTypeError(args: Omit<Args, 'expectedTypes'>): string;
export function getInvalidValueTypeError({ value, expectedType, expectedTypes }: Args): string {
  // For example, The actual type is 'number'.
  const actualTypeString = `The actual type is '${typeof value}'.`;

  if (typeof expectedType === 'string') {
    // For example, Value '03:00' is not of the expected type 'string'.
    return `Value '${value}' is not of the expected type '${expectedType}'. ${actualTypeString}`;
  }

  if (Array.isArray(expectedTypes)) {
    const MULTIPLE_EXPECTED_TYPES_SEPARATOR = ', ';

    const expectedTypesString = expectedTypes.map((type) => `'${type}'`).join(MULTIPLE_EXPECTED_TYPES_SEPARATOR);

    // For example, Value '554' is not one of the expected types: 'string', 'boolean'.
    return `Value '${value}' is not one of the expected types: '${expectedTypesString}'. ${actualTypeString}`;
  }

  throw new Error(getInvalidValueTypeError({ value: expectedType, expectedTypes: ['string', 'string[]'] }));
}
