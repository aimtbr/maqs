import {
  DATETIME_FORMAT_UTC_ISO8601,
  LEAP_YEAR_DAYS_IN_SECOND_MONTH,
  LEAP_YEAR_FREQUENCY,
  UTC_OFFSET,
  UTC_TIMEZONE,
} from 'src/lib/constants';

export class Maqs {
  /**
   * Returns the value provided as an argument to `constructor`.
   */
  sourceValue: string;

  /**
   * Returns the year.
   */
  year: number;

  /**
   * Returns the month from 1 to 12, where 1 is January.
   */
  month: number;

  /**
   * Returns the day from 1 to 31.
   */
  day: number;

  /**
   * Returns the hour from 0 to 23.
   */
  hour: number;

  /**
   * Returns the minute from 0 to 59.
   */
  minute: number;

  /**
   * Returns the second from 0 to 59.
   */
  second: number;

  /**
   * Returns the second from 0 to 999.
   */
  millisecond: number;

  /**
   * Returns the day of the week from 1 to 7, where 1 is Monday.
   */
  weekday: string;

  /**
   * Returns the time zone offset.
   *
   * For example, 0 for UTC or -180 for "-03:00" time zone.
   */
  timeZoneOffset: number = UTC_OFFSET;

  constructor(datetime: string) {
    const { year } = Maqs.#parseValue(datetime);

    this.year = year;
    this.sourceValue = datetime;
  }

  get daysInMonth(): number {
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (this.month === 2 && this.isLeapYear) {
      return LEAP_YEAR_DAYS_IN_SECOND_MONTH;
    }

    return daysPerMonth[this.month - 1];
  }

  get timeZone(): string {
    const MINUTES_IN_HOUR = 60;

    if (this.timeZoneOffset === UTC_OFFSET) {
      return UTC_TIMEZONE;
    }

    const offsetSign = this.timeZoneOffset >= 0 ? '+' : '-';

    const fullOffset = Math.abs(this.timeZoneOffset) / MINUTES_IN_HOUR;
    const hoursOffset = Math.trunc(fullOffset);
    const minutesOffset = Math.ceil((fullOffset - hoursOffset) * 60);

    return `${offsetSign}${String(hoursOffset).padStart(2, '0')}:${String(minutesOffset).padStart(2, '0')}`;
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

  static #parseValue(value: string) {
    try {
      const timeZoneRegex = /(+|-)\d\d:\d\d/;

      const date = new Date(value);

      const timeZoneOffset = value.search(timeZoneRegex);

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        localZoneOffset: date.getTimezoneOffset(),
        timeZoneOffset: timeZoneOffset === -1 ? undefined : timeZoneOffset,
      };
    } catch (error) {
      throw new Error(`"${value}" cannot be parsed: [${error}]`);
    }
  }

  toString(format = DATETIME_FORMAT_UTC_ISO8601): string {}

  toJSON(): string {
    return this.toString();
  }
}
