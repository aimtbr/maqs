import { getMarkerGroupByLevel } from 'src/lib/utils/private/getMarkerGroupByLevel';

/**
 * UTC
 */
export const UTC_OFFSET = 0;
export const UTC_TIMEZONE = '+00:00';

/**
 * Time zone
 */
export const TIMEZONE_EARLIEST = '+14:00';
export const TIMEZONE_LATEST = '-11:00';
export const TIMEZONE_EARLIEST_OFFSET = 840;
export const TIMEZONE_LATEST_OFFSET = -660;

/**
 * Leap year
 */
export const LEAP_YEAR_FREQUENCY = 4;
export const LEAP_YEAR_DAYS_IN_SECOND_MONTH = 29;
export const LEAP_YEAR_DAYS_IN_YEAR = 366;
/**
 * Datetime formats
 */
export const DATETIME_FORMAT_TZ_ISO8601 = 'YYYY-MM-DDTHH:mm:ss.SSSTZ';
export const DATETIME_FORMAT_UTC_ISO8601 = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

/**
 * Time
 */
export const DAYS_IN_YEAR = 365;
export const DAYS_IN_WEEK = 7;
export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_MINUTE = 60;
export const MILLISECONDS_IN_SECOND = 1000;

/**
 * Format
 */
export enum FormatMarkerGroup {
  YYYY = 'YYYY',
  YY = 'YY',
  MMMM = 'MMMM',
  MMM = 'MMM',
  MM = 'MM',
  M = 'M',
  DD = 'DD',
  D = 'D',
  dddd = 'dddd',
  ddd = 'ddd',
  HH = 'HH',
  hh = 'hh',
  h = 'h',
  mm = 'mm',
  m = 'm',
  ss = 'ss',
  s = 's',
  SSS = 'SSS',
  A = 'A',
  a = 'a',
  TZ = 'TZ',
  ESCAPE_OPEN = '[',
  ESCAPE_CLOSED = ']',
}

export enum FormatMarkerGroupLevel {
  FOURTH = 4,
  THIRD = 3,
  SECOND = 2,
  FIRST = 1,
}

export enum FormatMarkerGroupType {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
  WEEKDAY = 'weekday',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  FRACTIONAL_SECOND = 'fractionalSecond',
  DAY_PERIOD = 'dayPeriod',
  ESCAPE = 'escape',
  TEXT = 'text',
  TIME_ZONE = 'timezone',
}

export const FormatMarkerGroupTypeMap = Object.seal({
  [FormatMarkerGroup.YYYY]: FormatMarkerGroupType.YEAR,
  [FormatMarkerGroup.YY]: FormatMarkerGroupType.YEAR,
  [FormatMarkerGroup.MMMM]: FormatMarkerGroupType.MONTH,
  [FormatMarkerGroup.MMM]: FormatMarkerGroupType.MONTH,
  [FormatMarkerGroup.MM]: FormatMarkerGroupType.MONTH,
  [FormatMarkerGroup.M]: FormatMarkerGroupType.MONTH,
  [FormatMarkerGroup.DD]: FormatMarkerGroupType.DAY,
  [FormatMarkerGroup.D]: FormatMarkerGroupType.DAY,
  [FormatMarkerGroup.dddd]: FormatMarkerGroupType.WEEKDAY,
  [FormatMarkerGroup.ddd]: FormatMarkerGroupType.WEEKDAY,
  [FormatMarkerGroup.HH]: FormatMarkerGroupType.HOUR,
  [FormatMarkerGroup.hh]: FormatMarkerGroupType.HOUR,
  [FormatMarkerGroup.h]: FormatMarkerGroupType.HOUR,
  [FormatMarkerGroup.mm]: FormatMarkerGroupType.MINUTE,
  [FormatMarkerGroup.m]: FormatMarkerGroupType.MINUTE,
  [FormatMarkerGroup.ss]: FormatMarkerGroupType.SECOND,
  [FormatMarkerGroup.s]: FormatMarkerGroupType.SECOND,
  [FormatMarkerGroup.SSS]: FormatMarkerGroupType.FRACTIONAL_SECOND,
  [FormatMarkerGroup.A]: FormatMarkerGroupType.DAY_PERIOD,
  [FormatMarkerGroup.a]: FormatMarkerGroupType.DAY_PERIOD,
  [FormatMarkerGroup.TZ]: FormatMarkerGroupType.TIME_ZONE,
  [FormatMarkerGroup.ESCAPE_OPEN]: FormatMarkerGroupType.ESCAPE,
  [FormatMarkerGroup.ESCAPE_CLOSED]: FormatMarkerGroupType.ESCAPE,
});

export type FormatMarkerGroupLevelDictionary = {
  [Level in FormatMarkerGroupLevel]?: {
    [Group in FormatMarkerGroup]?: FormatMarkerGroupOptions;
  };
};

export type FormatMarkerGroupOptions = Intl.DateTimeFormatOptions;

type FormatMarkerGroupParams = {
  [key in FormatMarkerGroup]?: FormatMarkerGroupOptions;
};
export const FormatMarkerGroupParamsMap: FormatMarkerGroupParams = {
  YYYY: { year: 'numeric' }, // full year, for example, 2023
  MMMM: { month: 'long' }, // full month, for example, January
  dddd: { weekday: 'long' }, // full day of the week, for example, Monday, Sunday
  MMM: { month: 'short' }, // short month, for example, Jan
  ddd: { weekday: 'short' }, // short day of the week, for example, Mon, Sun
  SSS: { fractionalSecondDigits: 3 }, // millisecond, for example, 000, 999
  YY: { year: '2-digit' }, // 2-digits year, for example, 23
  MM: { month: '2-digit' }, // 2-digits month number, for example, 01, 12
  DD: { day: '2-digit' }, // 2-digits day number, for example, 01, 05, 31
  HH: { hour12: false, hour: '2-digit' }, // 2-digits hour, for example, 00, 23
  hh: { hour12: true, hour: '2-digit' }, // 2-digits hour, the 12-hour time format, for example, 00, 12
  mm: { minute: '2-digit' }, // 2-digits minute, for example, 00, 59
  ss: { second: '2-digit' }, // 2-digits second, for example, 00, 59
  M: { month: 'numeric' }, // month number, for example, 1, 12
  D: { day: 'numeric' }, // day number, for example, 1, 5, 31
  h: { hour12: true, hour: 'numeric' }, // hour, the 12-hour time format, for example, 0, 12
  m: { minute: 'numeric' }, // minute, for example, 0, 59
  s: { second: 'numeric' }, // second, for example, 0, 59
  A: { hour12: true }, // AM or PM (sets the time format to 12-hour if provided)
  a: { hour12: true }, // am or pm (sets the time format to 12-hour if provided)
};

export const FormatMarkerGroupLevels = Object.freeze(
  Object.values(FormatMarkerGroupLevel).reduce<FormatMarkerGroupLevelDictionary>(
    (accumulator, level) => ({
      ...accumulator,
      [level]: getMarkerGroupByLevel(level as FormatMarkerGroupLevel),
    }),
    {}
  )
);

export const FORMAT_MARKER_GROUPS = Object.keys(FormatMarkerGroup) as (keyof typeof FormatMarkerGroup)[];
export const FORMAT_LARGEST_MARKER_GROUP_SIZE = Math.max(
  ...FORMAT_MARKER_GROUPS.map((markerGroup) => markerGroup.length)
);
export const FORMAT_SMALLEST_MARKER_GROUP_SIZE = Math.min(
  ...FORMAT_MARKER_GROUPS.map((markerGroup) => markerGroup.length)
);
