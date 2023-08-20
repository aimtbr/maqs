import { FormatMarkerGroup, FormatMarkerGroupStrict } from 'src/types';

type Options = Intl.DateTimeFormatOptions & { type: string };

const fourthLevelMarkerGroups: Record<FormatMarkerGroupStrict<4>, Options> = {
  YYYY: { type: 'year', year: 'numeric' }, // full year, for example, 2023
  MMMM: { type: 'month', month: 'long' }, // full month, for example, January
  dddd: { type: 'weekday', weekday: 'long' }, // full day of the week, for example, Monday, Sunday
};

const thirdLevelMarkerGroups: Record<FormatMarkerGroupStrict<3>, Options> = {
  MMM: { type: 'month', month: 'short' }, // short month, for example, Jan
  ddd: { type: 'weekday', weekday: 'short' }, // short day of the week, for example, Mon, Sun
  SSS: { type: 'fractionalSecond', fractionalSecondDigits: 3 }, // millisecond, for example, 000, 999
};

const secondLevelMarkerGroups: Record<FormatMarkerGroupStrict<2>, Options> = {
  YY: { type: 'year', year: '2-digit' }, // 2-digits year, for example, 23
  MM: { type: 'month', month: '2-digit' }, // 2-digits month number, for example, 01, 12
  DD: { type: 'day', day: '2-digit' }, // 2-digits day number, for example, 01, 05, 31
  HH: { type: 'hour', hour12: false, hour: '2-digit' }, // 2-digits hour, for example, 00, 23
  hh: { type: 'hour', hour12: true, hour: '2-digit' }, // 2-digits hour, the 12-hour time format, for example, 00, 12
  mm: { type: 'minute', minute: '2-digit' }, // 2-digits minute, for example, 00, 59
  ss: { type: 'second', second: '2-digit' }, // 2-digits second, for example, 00, 59
};

const firstLevelMarkerGroups: Record<FormatMarkerGroupStrict<1>, Options> = {
  M: { type: 'month', month: 'numeric' }, // month number, for example, 1, 12
  D: { type: 'day', day: 'numeric' }, // day number, for example, 1, 5, 31
  h: { type: 'hour', hour12: true, hour: 'numeric' }, // hour, the 12-hour time format, for example, 0, 12
  m: { type: 'minute', minute: 'numeric' }, // minute, for example, 0, 59
  s: { type: 'second', second: 'numeric' }, // second, for example, 0, 59
  A: { type: 'dayPeriod', hour12: true }, // AM or PM (sets the time format to 12-hour if provided)
  a: { type: 'dayPeriod', hour12: true }, // am or pm (sets the time format to 12-hour if provided)
};

export const markerGroups = Object.seal({
  4: fourthLevelMarkerGroups,
  3: thirdLevelMarkerGroups,
  2: secondLevelMarkerGroups,
  1: firstLevelMarkerGroups,
});

export const isStringFormat = (format: string): boolean => {
  return markerGroups.some((markerGroup) => {
    // TODO: check if the string contains any of the marker groups starting from the longest ones
  });
};
