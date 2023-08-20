import { FormatMarker, FormatMarkerGroup } from 'src/types';

/**
 * UTC
 */
export const UTC_OFFSET = 0;
export const UTC_TIMEZONE = '+00:00';

/**
 * Time zone
 */
export const TIMEZONE_EARLIEST = '+14:00';
export const TIMEZONE_LATEST = '-11:00';
export const TIMEZONE_EARLIEST_OFFSET = 840;
export const TIMEZONE_LATEST_OFFSET = -660;

/**
 * Leap year
 */
export const LEAP_YEAR_FREQUENCY = 4;
export const LEAP_YEAR_DAYS_IN_SECOND_MONTH = 29;

/**
 * Datetime formats
 */
export const DATETIME_FORMAT_TZ_ISO8601 = 'YYYY-MM-DDTHH:mm:ss.SSSTZ';
export const DATETIME_FORMAT_UTC_ISO8601 = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

/**
 * Time
 */
export const MINUTES_IN_HOUR = 60;

/**
 * Format
 */
export const FORMAT_MARKERS = Object.keys(FormatMarker) as (keyof typeof FormatMarker)[];
export const FORMAT_MARKER_GROUPS = Object.keys(FormatMarkerGroup) as (keyof typeof FormatMarkerGroup)[];
export const FORMAT_LARGEST_MARKER_GROUP_SIZE = Math.max(
  ...FORMAT_MARKER_GROUPS.map((markerGroup) => markerGroup.length)
);
export const FORMAT_SMALLEST_MARKER_GROUP_SIZE = Math.min(
  ...FORMAT_MARKER_GROUPS.map((markerGroup) => markerGroup.length)
);
