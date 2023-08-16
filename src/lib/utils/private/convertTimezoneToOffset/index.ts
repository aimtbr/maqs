import { MINUTES_IN_HOUR, UTC_OFFSET } from 'src/lib/constants';

export const convertTimezoneToOffset = (timezone: string): number => {
  if (typeof timezone !== 'string') {
    return UTC_OFFSET;
  }

  const [hours, minutes] = timezone.split(':');

  const minutesInHours = Number(hours) * MINUTES_IN_HOUR;
  const minutesRemaining = Number(minutes) * Math.sign(minutesInHours);

  return minutesInHours + minutesRemaining;
};
