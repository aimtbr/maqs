import { UTC_OFFSET, UTC_TIMEZONE } from 'src/lib/constants';
import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { convertOffsetToTimezone } from 'src/lib/utils/private/convertOffsetToTimezone';
import { convertTimezoneToOffset } from 'src/lib/utils/private/convertTimezoneToOffset';
import { isTimezone } from 'src/lib/utils/public/isTimezone';
import { isTimezoneOffset } from 'src/lib/utils/public/isTimezoneOffset';

class Settings {
  constructor() {}

  protected timezoneOffset: number = UTC_OFFSET;

  setTimezone(timezone: string): void {
    if (!isTimezone(timezone)) {
      // TODO: use getReadableError
      throw new Error(`Value "${timezone}" is not a valid time zone. For example, "+03:00", "-05:00".`);
    }

    this.setTimezoneOffset(convertTimezoneToOffset(timezone));
  }

  setTimezoneOffset(offset: number): void {
    if (!isTimezoneOffset(offset)) {
      // TODO: use getReadableError
      throw new Error(
        `Value "${offset}" is not a valid time zone minutes offset. For example, -180, 0 or 240, where 0 is UTC.`
      );
    }

    this.timezoneOffset = offset;
  }
}

export const settings = new Settings();
