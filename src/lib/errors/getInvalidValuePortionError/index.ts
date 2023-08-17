type Args = {
  value: string | number | Date;
  portion: string | number;
  portionName: string;
  allowedValues?: (string | number)[];
};

export const getInvalidValuePortionError = ({ value, portion, portionName, allowedValues }: Args): string => {
  if (!allowedValues || allowedValues.length === 0) {
    // For example, Portion "+15:00" of value "2023-08-16T18:34:21.128+15:00" is not a valid time zone.
    return `Portion "${portion}" of value "${value}" is not a valid ${portionName}.`;
  }

  // For example, Portion "+15:00" of value "2023-08-16T18:34:21.128+15:00" is not a valid time zone.
  // Examples of acceptable values: "+03:00", "+00:00", "-05:00".
  return `Portion "${portion}" of value "${value}" is not a valid ${portionName}. Examples of acceptable values: ${allowedValues.join(
    ', '
  )}.`;
};
