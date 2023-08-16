export const getReadableError = (
  invalidValue: string | number,
  invalidValueType: string,
  allowedValues?: (string | number)[]
): string => {
  if (!allowedValues || allowedValues.length === 0) {
    return `Value "${invalidValue}" is not a valid ${invalidValueType}.`;
  }

  return `Value "${invalidValue}" is not a valid ${invalidValueType}. Examples of acceptable values: ${allowedValues.join(
    ', '
  )}.`;
};
