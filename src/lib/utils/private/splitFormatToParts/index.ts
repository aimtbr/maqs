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
  while (position < format.length) {
    let markerGroup = format.slice(position, position + step);

    let markerGroupHead = '';
    // while the marker group has at least one element, compare each potential marker group with the existing groups
    for (let markerGroupSize = markerGroup.length; markerGroupSize >= 1; markerGroupSize -= 1) {
      markerGroupHead = markerGroup.slice(0, markerGroupSize);

      if (markerGroups[markerGroupSize] && markerGroupHead in markerGroups[markerGroupSize]) {
        parts.push(markerGroupHead);

        // stop the loop
        markerGroupSize = 0;
      }

      // if the iteration is the last, merely take the marker
      const isSingleMarkerLeft = markerGroupSize === 1;
      if (isSingleMarkerLeft) {
        parts.push(markerGroupHead);
      }
    }

    position += markerGroupHead.length;

    // Note: probably, will never be the case
    // const markerGroupTail = markerGroup.slice(markerGroupHead.length, step);
    // if the last iteration
    // if (position >= format.length && markerGroupTail.length > 0) {
    //   parts.push(markerGroupTail);
    // }
  }

  return parts;
};
