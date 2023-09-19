import { DATETIME_FORMAT_UTC_ISO8601, UTC_OFFSET } from 'src/entities/Settings/constants';
import { getInvalidValueError } from 'src/lib/errors/getInvalidValueError';
import { convertOffsetToTimezone } from 'src/lib/utils/private/convertOffsetToTimezone';
import { convertTimezoneToOffset } from 'src/lib/utils/private/convertTimezoneToOffset';
import { isStringFormat } from 'src/lib/utils/public/isStringFormat';
import { isTimezone } from 'src/lib/utils/public/isTimezone';
import { isTimezoneOffset } from 'src/lib/utils/public/isTimezoneOffset';

class Settings {
  #timezoneOffset: number = UTC_OFFSET;
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
