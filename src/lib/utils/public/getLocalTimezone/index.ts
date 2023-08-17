import { convertOffsetToTimezone } from '../../private/convertOffsetToTimezone';
import { getLocalTimezoneOffset } from '../getLocalTimezoneOffset';

export const getLocalTimezone = (): string => {
  return convertOffsetToTimezone(getLocalTimezoneOffset());
};
