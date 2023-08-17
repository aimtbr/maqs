type Args = {
  value: string | number;
  name: string;
  allowedValues?: (string | number)[];
};

export const getInvalidValueError = ({ value, name, allowedValues }: Args): string => {
  if (!allowedValues || allowedValues.length === 0) {
    // For example, Value "03:00" is not a valid time zone.
    return `Value "${value}" is not a valid ${name}.`;
  }

  // For example, Value "03:00" is not a valid time zone. Examples of acceptable values: "+03:00", "+00:00", "-05:00".
  return `Value "${value}" is not a valid ${name}. Examples of acceptable values: ${allowedValues.join(', ')}.`;
};
