import {
  DATETIME_FORMAT_UTC_ISO8601,
  LEAP_YEAR_DAYS_IN_SECOND_MONTH,
  LEAP_YEAR_FREQUENCY,
  UTC_OFFSET,
  UTC_TIMEZONE,
} from 'src/lib/constants';
import { convertOffsetToTimeZone } from 'src/lib/utils/convertOffsetToTimeZone';
import { convertTimeZoneToOffset } from 'src/lib/utils/convertTimeZoneToOffset';
import { TimeFormat } from './types';
import { memory } from '../Memory';
import { PATTERN_TIMEZONE } from 'src/lib/patterns';

export class Maqs {
  /**
   * Returns the value provided as an argument to `constructor`.
   */
  protected sourceValue: string;

  /**
   * Returns the year.
   */
  protected year: number;

  /**
   * Returns the month from 1 to 12, where 1 is January.
   */
  protected month: number;

  /**
   * Returns the day from 1 to 31.
   */
  protected day: number;

  /**
   * Returns the hour from 0 to 23.
   */
  protected hour: number;

  /**
   * Returns the minute from 0 to 59.
   */
  protected minute: number;

  /**
   * Returns the second from 0 to 59.
   */
  protected second: number;

  /**
   * Returns the second from 0 to 999.
   */
  protected millisecond: number;

  /**
   * Returns the day of the week from 1 to 7, where 1 is Monday.
   */
  protected weekday: number;

  /**
   * Returns the time zone offset from `sourceValue`.
   *
   * For example, 0 for UTC or -180 for "-03:00" time zone.
   */
  protected timeZoneOffset: number = UTC_OFFSET;

  /**
   *
   */
  protected timeFormat: number = 24;

  constructor(datetime: string) {
    const parsedDate = Maqs.#parseValue(datetime);

    this.year = parsedDate.year;
    this.month = parsedDate.month;
    this.day = parsedDate.day;
    this.hour = parsedDate.hour;
    this.minute = parsedDate.minute;
    this.second = parsedDate.second;
    this.millisecond = parsedDate.millisecond;
    this.weekday = parsedDate.weekday;
    this.timeZoneOffset = parsedDate.timeZoneOffset;
    this.sourceValue = datetime;
  }

  /**
   *
   */
  get daysInMonth(): number {
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (this.month === 2 && this.isLeapYear) {
      return LEAP_YEAR_DAYS_IN_SECOND_MONTH;
    }

    return daysPerMonth[this.month - 1];
  }

  /**
   *
   */
  get timeZone(): string {
    return convertOffsetToTimeZone(this.timeZoneOffset);
  }

  /**
   * Indicates whether the instance time zone is UTC.
   */
  get isUTC(): boolean {
    return this.timeZoneOffset === UTC_OFFSET;
  }

  /**
   * Indicates whether the instance year is a leap year.
   */
  get isLeapYear(): boolean {
    return this.year % LEAP_YEAR_FREQUENCY === 0;
  }

  /**
   *
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
      this.timeZoneOffset,
      this.timeFormat,
    ];

    return properties.join('');
  }

  static #parseValue(value: string) {
    try {
      const timeZoneRegex = PATTERN_TIMEZONE;

      const date = new Date(value);

      if (Number.isNaN(date.valueOf())) {
        throw new Error(`Value "${value}" is not a valid date.`);
      }

      const weekday = date.getDay();
      const isSunday = weekday === 0;

      const timeZone = value.match(timeZoneRegex)?.[0];
      const isTimeZoneProvided = timeZone !== undefined;

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
        weekday: isSunday ? 7 : weekday,
        timeZoneOffset: isTimeZoneProvided ? convertTimeZoneToOffset(timeZone) : UTC_OFFSET,
      };
    } catch (error) {
      throw new Error(`Value "${value}" cannot be parsed: [${error}]`);
    }
  }

  /**
   * Set the time format.
   * @param timeFormat the time format that accepts either 12 or 24 representing the 12-hour or 24-hour formats respectively.
   */
  setTimeFormat(timeFormat: TimeFormat): Maqs {
    this.timeFormat = timeFormat;

    return this;
  }

  /**
   *
   * @param format
   */
  toString(format = DATETIME_FORMAT_UTC_ISO8601): string {
    const callId = `${this.#fingerprint}.${format}`;

    const result = '';

    // Note: maybe use Maqs.toString.name instead of 'toString'
    memory.memorizeCall({ functionName: 'toString', callId, result });

    return result;
  }

  toJSON(): string {
    return this.toString();
  }
}
