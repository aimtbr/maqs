import { MINUTES_IN_HOUR } from 'src/entities/Settings/constants';
import { getInvalidValueTypeError } from 'src/lib/errors/getInvalidValueTypeError';

export const convertTimezoneToOffset = (timezone: string): number => {
  const expectedType = 'string';
  if (typeof timezone !== expectedType) {
    throw new Error(getInvalidValueTypeError({ value: timezone, expectedType }));
  }

  const [hours, minutes] = timezone.split(':');

  const minutesInHours = Number(hours) * MINUTES_IN_HOUR;
  const minutesRemaining = Number(minutes) * Math.sign(minutesInHours);

  return minutesInHours + minutesRemaining;
};
