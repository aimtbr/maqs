import {
  FORMAT_LARGEST_MARKER_GROUP_SIZE,
  FormatMarkerGroup,
  FormatMarkerGroupType,
  FormatMarkerGroupTypeMap,
} from 'src/entities/Settings/constants';
import { splitByIndex } from '../splitByIndex';
import { countItem } from '../countItem';

type Part = {
  type: FormatMarkerGroupType;
  value: FormatMarkerGroup | string;
};
/**
 * Split the string format into an array of marker groups.
 * @example
 * splitFormatToParts('YYYY-MM-DD[A[anything]]A[A]HH:mm:ss.SSSZ')
 * splitFormatToParts('YYYY-MM-DDTHH:mm:ss.SSSZ')
 */
export const splitFormatToParts = (format: string): Part[] => {
  const step = format.length < FORMAT_LARGEST_MARKER_GROUP_SIZE ? format.length : FORMAT_LARGEST_MARKER_GROUP_SIZE;

  const parts: Part[] = [];

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
      const escapeClosedIndex = slice.indexOf(FormatMarkerGroup.ESCAPE_CLOSED);

      // if the current escape clause contains any ESCAPE_CLOSED marker
      if (escapeClosedIndex !== -1) {
        const [sliceHead, sliceTail] = splitByIndex(slice, escapeClosedIndex + 1);

        // count and add all nested OPEN markers in the current escape clause
        escapeNestingLevel += countItem(FormatMarkerGroup.ESCAPE_OPEN, sliceHead);
        // decrement the escape nesting level
        escapeNestingLevel -= 1;

        prevSliceTail = sliceTail; // get the remaining part

        // if no escape clauses active already, then release the currently stored escape clause immediately
        if (escapeNestingLevel === 0) {
          tempPart += sliceHead.slice(0, sliceHead.length - 1); // cut the ESCAPE_CLOSED marker from the result

          parts.push({ value: tempPart, type: FormatMarkerGroupType.ESCAPE });

          tempPart = '';
        } else {
          tempPart += sliceHead;
        }
        // otherwise, if it does not contain any ESCAPE_CLOSED marker, the entire slice is within the escape clause
      } else {
        tempPart += slice;
        prevSliceTail = '';
      }
    } else {
      for (let markerGroupLevel = step; markerGroupLevel >= 1; markerGroupLevel -= 1) {
        const [sliceHead, sliceTail] = splitByIndex(slice, markerGroupLevel);

        const isValidMarkerGroup = sliceHead in FormatMarkerGroup;
        if (isValidMarkerGroup) {
          // if tempPart was previously populated with the non-marker character sequence, then release it
          if (tempPart.length > 0) {
            parts.push({ value: tempPart, type: FormatMarkerGroupType.TEXT });

            tempPart = '';
          }

          parts.push({ value: sliceHead, type: FormatMarkerGroupTypeMap[sliceHead as FormatMarkerGroup] });

          // stop the loop
          markerGroupLevel = 0;
        }

        // if only 1 character left, save it
        const isSingleMarkerLeft = markerGroupLevel === 1;
        if (isSingleMarkerLeft) {
          // if the remaining character is ESCAPE_OPEN, then increment the nesting level and move forward
          // otherwise take the character and move forward
          if (sliceHead === FormatMarkerGroup.ESCAPE_OPEN) {
            escapeNestingLevel += 1;

            parts.push({ value: tempPart, type: FormatMarkerGroupType.TEXT });

            tempPart = '';
          } else {
            tempPart += sliceHead;
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
        parts.push({ value: tempPart, type: FormatMarkerGroupType.TEXT });

        tempPart = '';
      }
    }

    index += 1;
  }

  return parts;
};
