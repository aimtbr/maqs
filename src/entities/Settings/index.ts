import { DATETIME_FORMAT_UTC_ISO8601, UTC_OFFSET, UTC_TIMEZONE } from 'src/entities/Settings/constants';
import { getInvalidValueError } from 'src/lib/errors/getInvalidValueError';
import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { convertOffsetToTimezone } from 'src/lib/utils/private/convertOffsetToTimezone';
import { convertTimezoneToOffset } from 'src/lib/utils/private/convertTimezoneToOffset';
import { isTimezone } from 'src/lib/utils/public/isTimezone';
import { isTimezoneOffset } from 'src/lib/utils/public/isTimezoneOffset';
import { TimeFormat } from 'src/types';

class Settings {
  #timezoneOffset: number = UTC_OFFSET;
  #timeFormat: TimeFormat = 24;
  #defaultStringFormat: string = DATETIME_FORMAT_UTC_ISO8601;

  /**
   * The local time zone of all Maqs instances.
   *
   * For example, "+00:00" (UTC), "-03:00".
   *
   * @default "+00:00"
   */
  get timezone(): string {
    return convertOffsetToTimezone(this.timezoneOffset);
  }

  /**
   * The a local time zone offset in minutes of all Maqs instances.
   *
   * For example, 0 is UTC ("+00:00") or -180 is "-03:00" time zone.
   *
   * @default 0
   */
  get timezoneOffset(): number {
    return this.#timezoneOffset;
  }

  /**
   * The time format of all Maqs instances.
   *
   * Where 12 is for 12-hour and 24 for 24-hour respectively.
   *
   * @default 24
   */
  get timeFormat(): TimeFormat {
    return this.#timeFormat;
  }

  /**
   * The string format to use by default in the `toString` method of all Maqs instances.
   *
   * @default 'YYYY-MM-DDTHH:mm:ss.SSSZ'
   */
  get defaultStringFormat(): string {
    return this.#defaultStringFormat;
  }

  constructor() {}

  /**
   * Set a local time zone for all Maqs instances.
   *
   * @param timezone The time zone in the form of "HH:mm" or "-HH:mm", for example, "+03:00", "+00:00" (UTC), "-05:00".
   */
  setTimezone(timezone: string): Settings {
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
   * Set a local time zone offset in minutes for all Maqs instances.
   *
   * Same as using `setTimezone` but as a number of minutes.
   *
   * @param offset The time zone offset in minutes, for example, 180, 0, -300.
   */
  setTimezoneOffset(offset: number): Settings {
    if (!isTimezoneOffset(offset)) {
      throw new Error(getInvalidValueError({ value: offset, name: 'time zone offset', allowedValues: [180, 0, -300] }));
    }

    this.#timezoneOffset = offset;

    return this;
  }

  /**
   * Set a default time format of all Maqs instances.
   *
   * The time format is used to determine whether the 12-hour time should be displayed with AM/PM or the 24-hour time.
   *
   * @param timeFormat The time format that accepts either 12 or 24 representing the 12-hour or 24-hour formats respectively.
   */
  setTimeFormat(timeFormat: TimeFormat): Settings {
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
   * Set a string format to use in the `toString` method of all Maqs instances by default.
   * @param stringFormat The string format.
   */
  setDefaultStringFormat(format: string): Settings {
    if (!isStringFormat(format)) {
      throw new Error(
        getInvalidValueError({
          value: format,
          name: 'string format',
          allowedValues: [DATETIME_FORMAT_UTC_ISO8601],
        })
      );
    }

    this.#defaultStringFormat = format;

    return this;
  }

  // TODO: update multiple settings at once
}

export const settings = new Settings();
