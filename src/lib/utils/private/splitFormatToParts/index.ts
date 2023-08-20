import { FORMAT_LARGEST_MARKER_GROUP_SIZE, FORMAT_SMALLEST_MARKER_GROUP_SIZE } from 'src/entities/Settings/constants';
import { getInvalidValueTypeError } from 'src/lib/errors/getInvalidValueTypeError';
import { markerGroups } from '../../public/isStringFormat';

export const splitFormatToParts = (format: string): string[] => {
  if (typeof format !== 'string') {
    throw new Error(getInvalidValueTypeError({ value: format, expectedType: 'string' }));
  }

  const parts: string[] = [];
  const step = format.length < FORMAT_LARGEST_MARKER_GROUP_SIZE ? format.length : FORMAT_LARGEST_MARKER_GROUP_SIZE;

  let position = 0;
  let markerGroupTail = '';
  while (position < format.length) {
    let markerGroup = format.slice(position, position + step);

    let markerGroupHead = '';
    for (
      let markerGroupSize = markerGroup.length;
      markerGroupSize >= FORMAT_SMALLEST_MARKER_GROUP_SIZE;
      markerGroupSize -= 1
    ) {
      markerGroupHead = markerGroup.slice(0, markerGroupSize);

      if (markerGroupHead in markerGroups[markerGroupSize]) {
        parts.push(markerGroupHead);

        // stop the loop
        markerGroupSize = FORMAT_SMALLEST_MARKER_GROUP_SIZE - 1;
      }

      // if the last iteration
      if (markerGroupSize === FORMAT_SMALLEST_MARKER_GROUP_SIZE) {
        parts.push(markerGroupHead);
      }
    }

    markerGroupTail = markerGroup.slice(markerGroupHead.length, step);

    position += markerGroupHead.length;

    // if the last iteration
    if (position >= format.length && markerGroupTail.length > 0) {
      parts.push(markerGroupTail);
    }
  }

  return parts;
};
