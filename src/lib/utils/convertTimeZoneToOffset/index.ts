import { MINUTES_IN_HOUR, UTC_OFFSET } from 'src/lib/constants';

export const convertTimeZoneToOffset = (timeZone: string): number => {
  if (typeof timeZone !== 'string') {
    return UTC_OFFSET;
  }

  const [hours, minutes] = timeZone.split(':');

  const minutesInHours = Number(hours) * MINUTES_IN_HOUR;
  const minutesRemaining = Number(minutes) * Math.sign(minutesInHours);

  return minutesInHours + minutesRemaining;
};
