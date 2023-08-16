import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { convertTimezoneToOffset } from '../../private/convertTimezoneToOffset';
import { isTimezoneOffset } from '../isTimezoneOffset';
import { UTC_TIMEZONE } from 'src/lib/constants';

const aliases: Record<string, string> = {
  UTC: UTC_TIMEZONE,
};

export const isTimezone = (timezone: string) => {
  const isValidType = typeof timezone === 'string';
  if (!isValidType) {
    return false;
  }

  const aliasValue = aliases[timezone];
  const isAlias = aliasValue !== undefined;
  if (isAlias) {
    return aliasValue;
  }

  const isValidPattern = PATTERN_TIMEZONE.test(timezone);
  if (!isValidPattern) {
    return false;
  }

  // check if the number representation is valid
  const isValidOffset = isTimezoneOffset(convertTimezoneToOffset(timezone));

  return isValidOffset;
};
