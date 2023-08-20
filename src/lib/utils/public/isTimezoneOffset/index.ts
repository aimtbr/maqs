import { TIMEZONE_EARLIEST_OFFSET, TIMEZONE_LATEST_OFFSET } from 'src/entities/Settings/constants';

export const isTimezoneOffset = (offset: number): boolean => {
  const isValidType = typeof offset === 'number';
  if (!isValidType) {
    return false;
  }

  const isWithinRange = offset >= TIMEZONE_LATEST_OFFSET && offset <= TIMEZONE_EARLIEST_OFFSET;

  return isWithinRange;
};
