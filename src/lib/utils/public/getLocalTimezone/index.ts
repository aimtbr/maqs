import { convertOffsetToTimezone } from '../../private/convertOffsetToTimezone';

export const getLocalTimezone = (): string => {
  return convertOffsetToTimezone(new Date().getTimezoneOffset());
};
