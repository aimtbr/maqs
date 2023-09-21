import {
  FORMAT_MARKER_GROUPS,
  FormatMarkerGroup,
  FormatMarkerGroupParamsMap,
  FormatMarkerGroupType,
  LEAP_YEAR_DAYS_IN_SECOND_MONTH,
  LEAP_YEAR_FREQUENCY,
  MILLISECONDS_IN_SECOND,
  SECONDS_IN_MINUTE,
  UTC_OFFSET,
} from 'src/entities/Settings/constants';
import { convertTimezoneToOffset } from 'src/lib/utils/private/convertTimezoneToOffset';
import { memory } from '../Memory';
import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { isTimezone } from 'src/lib/utils/public/isTimezone';
import { convertOffsetToTimezone } from 'src/lib/utils/private/convertOffsetToTimezone';
import { isTimezoneOffset } from 'src/lib/utils/public/isTimezoneOffset';
import { getLocalTimezoneOffset } from 'src/lib/utils/public/getLocalTimezoneOffset';
import { getInvalidValuePortionError } from 'src/lib/errors/getInvalidValuePortionError';
import { getInvalidValueError } from 'src/lib/errors/getInvalidValueError';
import { settings } from '../Settings';
import { isStringFormat } from 'src/lib/utils/public/isStringFormat';
import { splitFormatToParts } from 'src/lib/utils/private/splitFormatToParts';
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

      // if the parsed value is invalid, valueOf returns NaN
      const timestamp = date.valueOf();
      if (Number.isNaN(timestamp)) {
        throw new Error(getInvalidValueError({ value, name: 'date' }));
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

  // TODO: implement setYear|Month|Day and so on
  /**
   * Set the milliseconds number of the current instance.
   *
   * @param milliseconds The number of milliseconds to add or subtract from the original value.
   */
  setMilliseconds(milliseconds: number): Maqs {
    if (typeof milliseconds !== 'number') {
      throw getInvalidValueTypeError({ value: milliseconds, expectedType: 'number' });
    }

    // if the invalid number of milliseconds was provided
    if (milliseconds < 0 || milliseconds >= MILLISECONDS_IN_SECOND) {
      throw getInvalidValueError({
        value: milliseconds,
        name: 'number of milliseconds',
        allowedValues: ['0', '999', 'and everything between'],
      });
    }

    this.#millisecond = milliseconds;

    return this;
  }

  addMilliseconds(milliseconds: number): Maqs {
    if (typeof milliseconds !== 'number') {
      throw getInvalidValueTypeError({ value: milliseconds, expectedType: 'number' });
    }

    // if adding
    if (milliseconds > 0) {
      // TODO: implement
    }

    // if subtracting
    if (milliseconds < 0) {
      // TODO: implement
    }

    return this;
  }

  subtractMilliseconds(milliseconds: number): Maqs {
    if (typeof milliseconds !== 'number') {
      throw getInvalidValueTypeError({ value: milliseconds, expectedType: 'number' });
    }

    this.addMilliseconds(-1 * milliseconds);

    return this;
  }

  /**
   * Set a time zone of the current instance.
   *
   * **Note: it doesn't update the current value, use `updateTimezone` instead.**
   *
   * @param timezone The time zone in the form of "+HH:mm" or "-HH:mm", for example, "+03:00", "+00:00" (UTC), "-05:00".
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
   * Set a time zone offset of the current instance.
   *
   * **Note: it doesn't update the current value, use `updateTimezoneOffset` instead.**
   *
   * @param offset The time zone offset in minutes, for example, 180, 0, -300.
   */
  setTimezoneOffset(offset: number): Maqs {
    if (!isTimezoneOffset(offset)) {
      throw new Error(getInvalidValueError({ value: offset, name: 'time zone offset', allowedValues: [180, 0, -300] }));
    }

    const prevTimezoneOffsetInMs = Math.abs(this.timezoneOffset * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND);
    const nextTimezoneOffsetInMs = offset * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

    this.#timezoneOffset = offset;
    // NOTE: UPDATE #timestamp EVERY TIME ANY TIME VALUE IS CHANGED (year, day, second, millisecond and so on)
    this.#timestamp = this.#timestamp - prevTimezoneOffsetInMs + nextTimezoneOffsetInMs;

    return this;
  }

  /**
   * Set a time zone offset and update the current instance.
   *
   * **Note: this method updates the
   */
  updateTimezone(timezone: string): Maqs {
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

    const timezoneOffset = convertTimezoneToOffset(timezone);

    this.setTimezoneOffset(timezoneOffset);

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
    if (!isStringFormat(format)) {
      throw new Error(
        getInvalidValueError({ value: format, name: 'string format', allowedValues: FORMAT_MARKER_GROUPS })
      );
    }

    // TODO: create a function to compose an ID from parts
    const callId = `${this.#fingerprint};${format}`;

    const formatParts = splitFormatToParts(format);

    const intlOptions = formatParts.reduce((accumulator, part, partIndex) => {
      const { type, value } = part;

      const isIntlMarker =
        type !== FormatMarkerGroupType.TEXT &&
        type !== FormatMarkerGroupType.TIME_ZONE &&
        type !== FormatMarkerGroupType.ESCAPE;
      // if the current part is not the first part found by its type, then it is a duplicate
      const isDuplicatedType = formatParts.findIndex((part) => part.type === type) !== partIndex;

      // if the type already exists or is not the Intl option, skip it
      if (isDuplicatedType || !isIntlMarker) {
        return accumulator;
      }

      const params = FormatMarkerGroupParamsMap[value as FormatMarkerGroup];

      return { ...accumulator, ...params };
    }, {});

    const intlFormatParts = new Intl.DateTimeFormat(undefined, intlOptions).formatToParts(this.timestamp);

    // map parts by type into values
    const result = formatParts
      .map((part) => {
        const { type, value } = part;

        const intlFormatPart = intlFormatParts.find((intlPart) => type === intlPart.type);

        // if the corresponding Intl part has the same type, then use its value
        if (intlFormatPart !== undefined) {
          const intlFormatPartValue = intlFormatPart.value;

          // if the marker group is a day period (AM, pm), then transform it to lower or upper case depending on the group
          if (type === FormatMarkerGroupType.DAY_PERIOD) {
            if (value === FormatMarkerGroup.A) {
              return intlFormatPartValue.toUpperCase();
            }

            return intlFormatPartValue.toLowerCase();
          }

          return intlFormatPartValue;
        }

        // if the marker group is a time zone, then replace the group with a time zone
        if (type === FormatMarkerGroupType.TIME_ZONE) {
          return this.timezone;
        }

        return value;
      })
      .join('');

    memory.memorizeCall({ functionName: 'toString', callId, result });

    return result;
  }

  toJSON(): string {
    return this.toString();
  }
}
