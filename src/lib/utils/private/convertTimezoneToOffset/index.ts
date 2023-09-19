import { MINUTES_IN_HOUR } from 'src/entities/Settings/constants';

export const convertTimezoneToOffset = (timezone: string): number => {
  const [hours, minutes] = timezone.split(':');

  const minutesInHours = Number(hours) * MINUTES_IN_HOUR;
  const minutesRemaining = Number(minutes) * Math.sign(minutesInHours);

  return minutesInHours + minutesRemaining;
};
