import { MINUTES_IN_HOUR, UTC_OFFSET, UTC_TIMEZONE } from 'src/lib/constants';

export const convertOffsetToTimezone = (offset: number): string => {
  if (typeof offset !== 'number') {
    return UTC_TIMEZONE;
  }

  if (offset === UTC_OFFSET) {
    return UTC_TIMEZONE;
  }

  const offsetSign = offset >= 0 ? '+' : '-';

  const fullOffset = Math.abs(offset) / MINUTES_IN_HOUR;
  const hoursOffset = Math.trunc(fullOffset);
  const minutesOffset = Math.ceil((fullOffset - hoursOffset) * 60);

  return `${offsetSign}${String(hoursOffset).padStart(2, '0')}:${String(minutesOffset).padStart(2, '0')}`;
};
