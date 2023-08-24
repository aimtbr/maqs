import { MINUTES_IN_HOUR, UTC_OFFSET, UTC_TIMEZONE } from 'src/entities/Settings/constants';
import { getInvalidValueTypeError } from 'src/lib/errors/getInvalidValueTypeError';

export const convertOffsetToTimezone = (offset: number): string => {
  const expectedType = 'number';
  if (typeof offset !== expectedType) {
    throw new Error(getInvalidValueTypeError({ value: offset, expectedType }));
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
