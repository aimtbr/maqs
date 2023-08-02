import { UTC_OFFSET } from 'src/lib/constants';
import { PATTERN_TIMEZONE } from 'src/lib/patterns';
import { convertOffsetToTimeZone } from 'src/lib/utils/convertOffsetToTimeZone';
import { convertTimeZoneToOffset } from 'src/lib/utils/convertTimeZoneToOffset';

class Settings {
  protected timeZoneOffset: number = UTC_OFFSET;

  constructor() {}

  get timeZone(): string {
    return convertOffsetToTimeZone(this.timeZoneOffset);
  }

  setTimeZone(timeZone: string): void {
    if (!PATTERN_TIMEZONE.test(timeZone)) {
      throw new Error(`Value "${timeZone}" is not a valid time zone. For example, "+03:00", "-05:00".`);
    }

    this.timeZoneOffset = convertTimeZoneToOffset(timeZone);
  }
}

export const settings = new Settings();
