type Args = {
  value: unknown;
  expectedType: string;
};

export const getInvalidValueTypeError = ({ value, expectedType }: Args): string => {
  TODO; // For example, Value "03:00" is not a valid time zone.
  return `Value "${value}" is not of the expected type ${expectedType}.`;
};
