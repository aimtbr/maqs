export { convert } from './modules/convert';
export { compare } from './modules/compare';
import { Maqs, MaqsAccepts } from './entities/Maqs';
import { settings } from './entities/Settings';
import { today } from './lib/utils/public/today';
// TODO: implement the async version of Maqs to dynamically import all dependencies
// export { AMaqs } from './entities/MaqsAsync';

const initializer = function (datetime: MaqsAccepts) {
  return new Maqs(datetime);
};
initializer.settings = settings;
initializer.today = today;

export const maqs = Object.freeze(initializer);

// TODO: update a locale
console.log(maqs.today().setTimezone('+07:00').toString('Hello [A] [MM], DD MMMM, HH:mm ATZ'));

/**
 * 1. Get the current date
 * 2. Parse from a time zone or locale, set a time zone and locale
 * 3. Convert to a local formatted string, ISO, Date
 * 4. Compare dates (booleans)
 * 5. Get and set the time units (year, day and so on)
 * 6. Manipulate the date (subtract, add the time units)
 * 7. Difference between dates (string, milliseconds number)
 */

/**
 * Examples:
 *    Constants:
 *    const DATETIME_PATTERN_TZ_ISO8601 = 'YYYY-MM-DDTHH:MM:SS.SSSTZ';
 *    const DATETIME_PATTERN_UTC_ISO8601 = 'YYYY-MM-DDTHH:MM:SS.SSSZ';
 *
 * father (dad), mother (mom)
 *    NOTE: maqs(datetime: string) without a time zone is considered UTC
 *
 * 1. maqs.today().toString(format = DATETIME_PATTERN_TZ_ISO8601); // return the current date
 *
 * 2. maqs(timestamp: string).makeUTC().toString(format = DATETIME_PATTERN_UTC_ISO8601) // ISO 8601 with a time zone
 *    maqs(timestamp: string).makeLocal().toString(format = DATETIME_PATTERN_TZ_ISO8601) // ISO 8601 without a time zone
 *
 * 3. maqs(datetime: string).asLocal().toString(format = DATETIME_PATTERN_TZ_ISO8601) // ISO 8601 with a time zone
 *    maqs(datetime: string).asUTC().toString(format = DATETIME_PATTERN_UTC_ISO8601) // ISO 8601 without a time zone
 *
 * 4. maqs.today()
 *      .setTimeZone(timezone: string e.g. '+03:00')
 *      .setTimeZoneOffset(timezone: number e.g. 180)
 *      .setYear|Month|Day|Hour|Minute|Second(number | (value) => number)
 *      .toString(format = DATETIME_PATTERN_TZ_ISO8601)
 *
 * 5. maqs(datetime: string)
 *      .addYear|Month|Day|Hour|Minute|Second(value: number)
 *      .subtractYear|Month|Day|Hour|Minute|Second(value: number)
 *      .updateTimeZone(timezone: number (minutes) | string e.g. '+03:00') // set the time zone and update the datetime respectively
 *      .toString(format = DATETIME_PATTERN_TZ_ISO8601 | DATETIME_PATTERN_UTC_ISO8601) // UTC if the time zone is 0, otherwise TZ
 *
 * 6. maqs.today().timeZone, maqs(datetime: string).timeZone
 *    maqs.today().year, maqs(datetime: string).year
 *    maqs.today().daysInMonth, maqs(datetime: string).daysInMonth
 *    maqs.today().isLeapYear, maqs(datetime: string).isLeapYear
 *
 * 7. maqs(datetime: string)
 *      .setTimeFormat(value: 12 | 24)
 *      .toString(format = DATETIME_PATTERN_TZ_ISO8601 | DATETIME_PATTERN_UTC_ISO8601) // UTC if the time zone is 0, otherwise TZ
 */

/**
 * Properties
 * 1. calendar (Intl.DateTimeFormat().resolvedOptions())
 * 2. locale (Intl.DateTimeFormat().resolvedOptions())
 *
 * Validations
 * 1. isTimeZone (use in convertTimeZoneToOffset)
 * 2. isFormatPattern (use in toString)
 *
 * Utils
 * 1. clone
 */
