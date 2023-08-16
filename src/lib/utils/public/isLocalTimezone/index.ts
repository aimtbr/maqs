import { getLocalTimezone } from '../getLocalTimezone';

export const isLocalTimezone = (timezone: string): boolean => {
  return getLocalTimezone() === timezone;
};
