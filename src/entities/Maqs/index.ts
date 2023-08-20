import { LEAP_YEAR_DAYS_IN_SECOND_MONTH, LEAP_YEAR_FREQUENCY, UTC_OFFSET } from 'src/entities/Settings/constants';
import { convertTimezoneToOffset } from 'src/lib/utils/private/convertTimezoneToOffset';
import { TimeFormat } from 'src/types';
import { memory } from '../Memory';
import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { isTimezone } from 'src/lib/utils/public/isTimezone';
import { convertOffsetToTimezone } from 'src/lib/utils/private/convertOffsetToTimezone';
import { isTimezoneOffset } from 'src/lib/utils/public/isTimezoneOffset';
import { getLocalTimezoneOffset } from 'src/lib/utils/public/getLocalTimezoneOffset';
import { getInvalidValuePortionError } from 'src/lib/errors/getInvalidValuePortionError';
import { getInvalidValueError } from 'src/lib/errors/getInvalidValueError';
import { settings } from '../Settings';
import { getInvalidValueTypeError } from 'src/lib/errors/getInvalidValueTypeError';

export type MaqsAccepts = string | number | Date | Maqs;

export class Maqs {
  // PROPERTIES
  #sourceValue: MaqsAccepts;
  #year: number;
  #month: number;
  #day: number;
  #hour: number;
  #minute: number;
  #second: number;
  #millisecond: number;
  #weekday: number;
  #timestamp: number;
  #timezoneOffset: number = settings.timezoneOffset;
  #timeFormat: number = settings.timeFormat;

  // GETTERS
  /**
   * The value provided as an argument to `constructor`.
   */
  get sourceValue() {
    return this.#sourceValue;
  }

  /**
   * The year of the current value.
   */
  get year() {
    return this.#year;
  }

  /**
   * The month of the current value [1-12], where 1 is January.
   */
  get month() {
    return this.#month;
  }

  /**
   * The day of the month of the current value [1-31].
   */
  get day() {
    return this.#day;
  }

  /**
   * The hour of the current value [0-23].
   */
  get hour() {
    return this.#hour;
  }

  /**
   * The minute of the current value [0-59].
   */
  get minute() {
    return this.#minute;
  }

  /**
   * The second of the current value [0-59].
   */
  get second() {
    return this.#second;
  }

  /**
   * The second of the current value [0-999].
   */
  get millisecond() {
    return this.#millisecond;
  }

  /**
   * The day of the week of the current value [1-7], where 1 is Monday.
   */
  get weekday() {
    return this.#weekday;
  }

  /**
   * The number of milliseconds since the [epoch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_epoch_timestamps_and_invalid_date).
   */
  get timestamp() {
    return this.#timestamp;
  }

  /**
   * The time zone offset of the current value.
   *
   * For example, 0 is UTC ("+00:00") or -180 is "-03:00" time zone.
   *
   * @default 0
   */
  get timezoneOffset() {
    return this.#timezoneOffset;
  }

  /**
   * The time format of the current value.
   *
   * The formatted output string will be represented with AM or PM if 12 is provided.
   *
   * Where 12 is for 12-hour and 24 for 24-hour respectively.
   *
   * @default 24
   */
  get timeFormat() {
    return this.#timeFormat;
  }

  /**
   * The time zone of the current value.
   *
   * For example, "+00:00" (UTC), "-03:00".
   *
   * @default "+00:00"
   */
  get timezone(): string {
    return convertOffsetToTimezone(this.timezoneOffset);
  }

  /**
   * The number of days in the `month` of the current value.
   */
  get daysInMonth(): number {
    const daysPerMonthMap: Record<number, number> = {
      1: 31,
      2: 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };

    if (this.month === 2 && this.isLeapYear) {
      return LEAP_YEAR_DAYS_IN_SECOND_MONTH;
    }

    return daysPerMonthMap[this.month];
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

  constructor(datetime: MaqsAccepts) {
    const parsedDate = Maqs.#parseValue(datetime);

    this.#year = parsedDate.year;
    this.#month = parsedDate.month;
    this.#day = parsedDate.day;
    this.#hour = parsedDate.hour;
    this.#minute = parsedDate.minute;
    this.#second = parsedDate.second;
    this.#millisecond = parsedDate.millisecond;
    this.#weekday = parsedDate.weekday;
    this.#timestamp = parsedDate.timestamp;
    this.#timezoneOffset = parsedDate.timezoneOffset;
    this.#sourceValue = datetime;
  }

  static #parseValue(value: MaqsAccepts) {
    try {
      if (value instanceof Maqs) {
        return value;
      }

      // if the value is an instance of Date, then no need to wrap it with Date once more
      let date = value as Date;
      if (!(value instanceof Date)) {
        date = new Date(value);
      }

      // if the parsed value is invalid, it returns NaN
      const timestamp = date.valueOf();
      if (Number.isNaN(timestamp)) {
        throw new Error(getInvalidValueError({ value: value as string | number, name: 'date' }));
      }

      const timezone = typeof value === 'string' ? value.match(PATTERN_TIMEZONE)?.[0] : undefined;
      const isTimezoneProvided = timezone !== undefined;
      if (isTimezoneProvided && !isTimezone(timezone)) {
        throw new Error(
          getInvalidValuePortionError({
            value,
            portion: timezone,
            portionName: 'time zone',
            allowedValues: ['+03:00', '+00:00', '-05:00'],
          })
        );
      }

      const weekday = date.getDay();
      const isSunday = weekday === 0;

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
        timestamp,
      };
    } catch (error) {
      throw new Error(`Value "${value}" cannot be parsed: [${error}]`);
    }
  }

  /**
   * Set a time format.
   * @param timeFormat The time format that accepts either 12 or 24 representing the 12-hour or 24-hour formats respectively.
   */
  setTimeFormat(timeFormat: TimeFormat): Maqs {
    const allowedTimeFormats: TimeFormat[] = [12, 24];

    const isTimeFormatValid = allowedTimeFormats.includes(timeFormat);
    if (!isTimeFormatValid) {
      throw new Error(
        getInvalidValueError({ value: timeFormat, name: 'time format', allowedValues: allowedTimeFormats })
      );
    }

    this.#timeFormat = timeFormat;

    return this;
  }

  /**
   * Set a time zone.
   *
   * **Note: it doesn't update the current value, use `updateTimezone` instead.**
   *
   * @param timezone The time zone in the form of "HH:mm" or "-HH:mm", for example, "+03:00", "+00:00" (UTC), "-05:00".
   */
  setTimezone(timezone: string): Maqs {
    const isValidType = typeof timezone === 'string';
    if (!isValidType) {
      throw new Error(
        getInvalidValueError({ value: timezone, name: 'time zone', allowedValues: ['+03:00', '+00:00', '-05:00'] })
      );
    }

    if (!isTimezone(timezone)) {
      throw new Error(
        getInvalidValueError({ value: timezone, name: 'time zone', allowedValues: ['+03:00', '+00:00', '-05:00'] })
      );
    }

    this.setTimezoneOffset(convertTimezoneToOffset(timezone));

    return this;
  }

  /**
   * Set a time zone offset.
   *
   * **Note: it doesn't update the current value, use `updateTimezoneOffset` instead.**
   *
   * @param offset The time zone offset in minutes, for example, 180, 0, -300.
   */
  setTimezoneOffset(offset: number): Maqs {
    if (!isTimezoneOffset(offset)) {
      throw new Error(getInvalidValueError({ value: offset, name: 'time zone offset', allowedValues: [180, 0, -300] }));
    }

    this.#timezoneOffset = offset;

    return this;
  }

  /**
   * Sets the time zone of the current value to local.
   */
  asLocal(): Maqs {
    this.setTimezoneOffset(getLocalTimezoneOffset());

    return this;
  }

  /**
   *
   * @param format
   */
  toString(format = settings.defaultStringFormat): string {
    if (typeof format !== 'string') {
      throw new Error(getInvalidValueTypeError({ value: format, expectedType: 'string' }));
    }

    const callId = `${this.#fingerprint};${format}`;

    // Add AM/PM or am/pm, and Z or time zone manually

    const options = {};

    const templateToString = () => {};

    // templateToString`${}:${}`

    const result = '';

    memory.memorizeCall({ functionName: 'toString', callId, result });

    return result;
  }

  toJSON(): string {
    return this.toString();
  }
}
