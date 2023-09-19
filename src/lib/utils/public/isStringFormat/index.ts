import { FORMAT_LARGEST_MARKER_GROUP_SIZE, FormatMarkerGroup } from 'src/entities/Settings/constants';

export const isStringFormat = (format: string): boolean => {
  if (typeof format !== 'string') {
    return false;
  }

  const step = format.length < FORMAT_LARGEST_MARKER_GROUP_SIZE ? format.length : FORMAT_LARGEST_MARKER_GROUP_SIZE;
  // TODO: take the ESCAPE markers into account
  let position = 0;
  while (position < format.length) {
    let markerGroup = format.slice(position, position + step);

    let markerGroupHead = '';
    // while the marker group has at least one element, compare each potential marker group with the existing groups
    for (let markerGroupLevel = markerGroup.length; markerGroupLevel >= 1; markerGroupLevel -= 1) {
      markerGroupHead = markerGroup.slice(0, markerGroupLevel);

      // if any combination of characters from left to right in format matches any marker group
      if (markerGroupHead in FormatMarkerGroup) {
        return true;
      }
    }

    position += markerGroupHead.length;
  }

  return false;
};
