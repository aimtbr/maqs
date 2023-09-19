import { FormatMarkerGroup } from 'src/entities/Settings/constants';

const ESCAPE_CHARACTERS = [FormatMarkerGroup.ESCAPE_OPEN, FormatMarkerGroup.ESCAPE_CLOSED];

/**
 * Remove all escape characters from `value`.
 *
 * Escape characters: `"[", "]"`
 */
export const clearEscapes = (value: string) => {
  if (typeof value !== 'string' || value.length === 0) {
    return '';
  }

  const clearedValue = Array.prototype.filter
    .call(value, (character) => !ESCAPE_CHARACTERS.includes(character as FormatMarkerGroup))
    .join('');

  return clearedValue;
};
