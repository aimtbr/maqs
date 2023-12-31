import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { convertTimezoneToOffset } from '../../private/convertTimezoneToOffset';
import { isTimezoneOffset } from '../isTimezoneOffset';

export const isTimezone = (timezone: string): boolean => {
  const isValidType = typeof timezone === 'string';
  if (!isValidType) {
    return false;
  }

  const isValidPattern = PATTERN_TIMEZONE.test(timezone);
  if (!isValidPattern) {
    return false;
  }

  // check if the number representation is valid
  const isValidOffset = isTimezoneOffset(convertTimezoneToOffset(timezone));

  return isValidOffset;
};
