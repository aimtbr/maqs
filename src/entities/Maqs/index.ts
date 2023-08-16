import {
  DATETIME_FORMAT_UTC_ISO8601,
  LEAP_YEAR_DAYS_IN_SECOND_MONTH,
  LEAP_YEAR_FREQUENCY,
  UTC_OFFSET,
  UTC_TIMEZONE,
} from 'src/lib/constants';
import { convertTimezoneToOffset } from 'src/lib/utils/private/convertTimezoneToOffset';
import { TimeFormat } from './types';
import { memory } from '../Memory';
import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { isTimezone } from 'src/lib/utils/public/isTimezone';
import { convertOffsetToTimezone } from 'src/lib/utils/private/convertOffsetToTimezone';
import { isTimezoneOffset } from 'src/lib/utils/public/isTimezoneOffset';
import { getLocalTimezoneOffset } from 'src/lib/utils/public/getLocalTimezoneOffset';
import { getReadableError } from 'src/lib/utils/private/getReadableError';

export class Maqs {
  /**
   * Returns the value provided as an argument to `constructor`.
   */
  protected sourceValue: string | number | Date;

  /**
   * Returns the year of the current value.
   */
  protected year: number;

  /**
   * Returns the month of the current value [1-12], where 1 is January.
   */
  protected month: number;

  /**
   * Returns the day of the month of the current value [1-31].
   */
  protected day: number;

  /**
   * Returns the hour of the current value [0-23].
   */
  protected hour: number;

  /**
   * Returns the minute of the current value [0-59].
   */
  protected minute: number;

  /**
   * Returns the second of the current value [0-59].
   */
  protected second: number;

  /**
   * Returns the second of the current value [0-999].
   */
  protected millisecond: number;

  /**
   * Returns the day of the week of the current value [1-7], where 1 is Monday.
   */
  protected weekday: number;

  /**
   * Returns the time zone offset of the current value.
   *
   * For example, 0 is UTC ("+00:00") or -180 is "-03:00" time zone.
   *
   * @default 0
   */
  protected timezoneOffset: number = UTC_OFFSET;

  /**
   * Returns a time format of the current value.
   *
   * The formatted output string will be represented with AM or PM if 12 is provided.
   *
   * Where 12 is for 12-hour and 24 for 24-hour respectively.
   *
   * @default 24
   */
  protected timeFormat: number = 24;

  constructor(datetime: string | number | Date) {
    const parsedDate = Maqs.#parseValue(datetime);

    this.year = parsedDate.year;
    this.month = parsedDate.month;
    this.day = parsedDate.day;
    this.hour = parsedDate.hour;
    this.minute = parsedDate.minute;
    this.second = parsedDate.second;
    this.millisecond = parsedDate.millisecond;
    this.weekday = parsedDate.weekday;
    this.timezoneOffset = parsedDate.timezoneOffset;
    this.sourceValue = datetime;
  }

  /**
   * Returns the number of days in the `month` of the current value.
   */
  get daysInMonth(): number {
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (this.month === 2 && this.isLeapYear) {
      return LEAP_YEAR_DAYS_IN_SECOND_MONTH;
    }

    return daysPerMonth[this.month - 1];
  }

  /**
   * Returns the time zone of the current value.
   *
   * For example, "+00:00" (UTC), "-03:00".
   *
   * @default "+00:00"
   */
  get timezone(): string {
    return convertOffsetToTimezone(this.timezoneOffset);
  }

  /**
   * Indicates whether the current value `timezone` is UTC.
   */
  get isUTC(): boolean {
    return this.timezoneOffset === UTC_OFFSET;
  }

  /**
   * Indicates whether the current value `year` is a leap year.
   */
  get isLeapYear(): boolean {
    return this.year % LEAP_YEAR_FREQUENCY === 0;
  }

  /**
   * Returns a string representing the properties of the current instance combined.
   */
  get #fingerprint(): string {
    const properties = [
      this.year,
      this.month,
      this.day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.timezoneOffset,
      this.timeFormat,
    ];

    return properties.join('');
  }

  static #parseValue(value: string | number | Date) {
    try {
      let date = value as Date;

      if (!(value instanceof Date)) {
        date = new Date(value);
      }

      if (Number.isNaN(date.valueOf())) {
        throw new Error(getReadableError(value as string | number, 'date'));
      }

      const weekday = date.getDay();
      const isSunday = weekday === 0;

      const timezone = typeof value === 'string' ? value.match(PATTERN_TIMEZONE)?.[0] : undefined;
      const isTimezoneProvided = timezone !== undefined;

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
        weekday: isSunday ? 7 : weekday,
        timezoneOffset: isTimezoneProvided ? convertTimezoneToOffset(timezone) : UTC_OFFSET,
      };
    } catch (error) {
      throw new Error(`Value "${value}" cannot be parsed: [${error}]`);
    }
  }

  /**
   * Set a time format.
   * @param timeFormat the time format that accepts either 12 or 24 representing the 12-hour or 24-hour forksmats respectively.
   */
  setTimeFormat(timeFormat: TimeFormat): Maqs {
    const allowedTimeFormats: TimeFormat[] = [12, 24];

    const isTimeFormatValid = allowedTimeFormats.includes(timeFormat);
    if (!isTimeFormatValid) {
      throw new Error(getReadableError(timeFormat, 'time format', allowedTimeFormats));
    }

    this.timeFormat = timeFormat;

    return this;
  }

  /**
   * Set a time zone.
   *
   * Note: it doesn't update the current value.
   * @param timezone the time zone in the form of HH:mm" or "-HH:mm", for example, "+03:00", "+00:00" (UTC), "-05:00".
   */
  setTimezone(timezone: string): Maqs {
    if (!isTimezone(timezone)) {
      throw new Error(getReadableError(timezone, 'time zone', ['+03:00', '+00:00', '-05:00']));
    }

    this.setTimezoneOffset(convertTimezoneToOffset(timezone));

    return this;
  }

  /**
   * Set a time zone offset.
   *
   * Note: it doesn't update the current value.
   * @param offset the time zone offset in minutes, for example, 180, 0, -300.
   */
  setTimezoneOffset(offset: number): Maqs {
    if (!isTimezoneOffset(offset)) {
      throw new Error(getReadableError(offset, 'time zone offset', [180, 0, -300]));
    }

    this.timezoneOffset = offset;

    return this;
  }

  asLocal(): Maqs {
    this.setTimezoneOffset(getLocalTimezoneOffset());

    return this;
  }

  /**
   *
   * @param format
   */
  toString(format = DATETIME_FORMAT_UTC_ISO8601): string {
    const callId = `${this.#fingerprint};${format}`;

    // TODO: parse the format by checking if the sequence of characters is still valid or not, if not, then step back and take the composed value
    const markerMap = {
      YYYY: { type: 'year', year: 'numeric' }, // full year, for example, 2023
      YY: { type: 'year', year: '2-digit' }, // 2-digits year, for example, 23
      MMMM: { type: 'month', month: 'long' }, // full month, for example, January
      MMM: { type: 'month', month: 'short' }, // short month, for example, Jan
      MM: { type: 'month', month: '2-digit' }, // 2-digits month number, for example, 01, 12
      M: { type: 'month', month: 'numeric' }, // month number, for example, 1, 12
      DD: { type: 'day', day: '2-digit' }, // 2-digits day number, for example, 01, 05, 31
      D: { type: 'day', day: 'numeric' }, // day number, for example, 1, 5, 31
      dddd: { type: 'weekday', weekday: 'long' }, // full day of the week, for example, Monday, Sunday
      ddd: { type: 'weekday', weekday: 'short' }, // short day of the week, for example, Mon, Sun
      HH: { type: 'hour', hour: '2-digit' }, // 2-digits hour, for example, 00, 23
      H: { type: 'hour', hour: 'numeric' }, // hour, for example, 0, 23
      hh: { type: 'hour', hour12: true, hour: '2-digit' }, // 2-digits hour, the 12-hour time format, for example, 00, 12
      h: { type: 'hour', hour12: true, hour: 'numeric' }, // hour, the 12-hour time format, for example, 0, 12
      mm: { type: 'minute', minute: '2-digit' }, // 2-digits minute, for example, 00, 59
      m: { type: 'minute', minute: 'numeric' }, // minute, for example, 0, 59
      ss: { type: 'second', second: '2-digit' }, // 2-digits second, for example, 00, 59
      s: { type: 'second', second: 'numeric' }, // second, for example, 0, 59
      SSS: { type: 'fractionalSecond', fractionalSecondDigits: 3 }, // millisecond, for example, 000, 999
      A: { type: 'dayPeriod', hour12: true }, // AM or PM (sets the time format to 12-hour if provided)
      a: { type: 'dayPeriod', hour12: true }, // am or pm (sets the time format to 12-hour if provided)
    };

    const result = '';

    memory.memorizeCall({ functionName: 'toString', callId, result });

    return result;
  }

  toJSON(): string {
    return this.toString();
  }
}
