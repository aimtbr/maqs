import { FORMAT_LARGEST_MARKER_GROUP_SIZE, FormatMarkerEscape } from 'src/entities/Settings/constants';
import { markerGroups } from '../../public/isStringFormat';
import { splitByIndex } from '../splitByIndex';
import { countItem } from '../countItem';

export const splitFormatToParts = (format: string): string[] => {
  const step = format.length < FORMAT_LARGEST_MARKER_GROUP_SIZE ? format.length : FORMAT_LARGEST_MARKER_GROUP_SIZE;

  const parts: string[] = [];

  const slices = splitByIndex(format, (index) => index + step);

  const isLastIteration = (index: number) => index + 1 === slices.length;

  let escapeNestingLevel = 0;
  let tempPart = '';
  let prevSliceTail = '';
  let index = 0;

  for (let slice of slices) {
    slice = prevSliceTail.concat(slice);

    const isInsideEscapeClause = escapeNestingLevel > 0;
    if (isInsideEscapeClause) {
      const escapeClosedIndex = slice.indexOf(FormatMarkerEscape.CLOSED);

      // if the current escape clause contains any CLOSED marker
      if (escapeClosedIndex !== -1) {
        // increment escapeClosedIndex to capture CLOSED too
        const [sliceHead, sliceTail] = splitByIndex(slice, escapeClosedIndex + 1);

        tempPart += sliceHead;
        prevSliceTail = sliceTail;
        // count and add all nested OPEN markers in the current escape clause
        escapeNestingLevel += countItem(FormatMarkerEscape.OPEN, sliceHead);
        // decrement the escape nesting level
        escapeNestingLevel -= 1;

        // if no escape clauses active already, then release the currently stored escape clause immediately
        if (escapeNestingLevel === 0) {
          parts.push(tempPart);

          tempPart = '';
        }
        // otherwise, if it does not contain any CLOSED marker, the entire slice is within the escape clause
      } else {
        tempPart += slice;
        prevSliceTail = '';
      }
    } else {
      for (let markerGroupSize = step; markerGroupSize >= 1; markerGroupSize -= 1) {
        const [sliceHead, sliceTail] = splitByIndex(slice, markerGroupSize);

        const isValidMarkerGroup = markerGroups[markerGroupSize] && sliceHead in markerGroups[markerGroupSize];
        if (isValidMarkerGroup) {
          // if tempPart was previously populated with the non-marker character sequence, then release it
          if (tempPart.length > 0) {
            parts.push(tempPart);

            tempPart = '';
          }

          parts.push(sliceHead);

          // stop the loop
          markerGroupSize = 0;
        }

        // if only 1 character left, save it
        const isSingleMarkerLeft = markerGroupSize === 1;
        if (isSingleMarkerLeft) {
          tempPart += sliceHead;

          if (sliceHead === FormatMarkerEscape.OPEN) {
            escapeNestingLevel += 1;
          }
        }

        prevSliceTail = sliceTail;
      }
    }

    if (isLastIteration(index)) {
      const shouldProcessTail = prevSliceTail.length > 0;
      if (shouldProcessTail) {
        // add another iteration to process the remaining tail
        slices.push(prevSliceTail);

        prevSliceTail = '';
      }

      // if tempPart still stores the non-marker character sequence at the end of the loop, then release it
      if (tempPart.length > 0 && !shouldProcessTail) {
        parts.push(tempPart);

        tempPart = '';
      }
    }

    index += 1;
  }

  return parts;
};
