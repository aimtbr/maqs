import { getInvalidValueError } from 'src/lib/errors/getInvalidValueError';
import { getInvalidValueTypeError } from 'src/lib/errors/getInvalidValueTypeError';

// Overload 1
/**
 * Split a string into a tuple at the specified `index`.
 */
export function splitByIndex(value: string, index: number): [string, string];

// Overload 2
/**
 * Split a string into an array of strings by computed indices.
 *
 * @example
 * splitByIndex('123456789', (value) => value + 2) // returns ["12", "45", "67", "89"]
 * splitByIndex('123456789', (value) => value + 4) // returns ["1245", "6789"]
 * splitByIndex('123456789', (value) => value - 2) // throws an error, because the loop goes forward only
 * splitByIndex('123456789', (value) => value) // throws an error, because the index remains unchanged
 */
export function splitByIndex(value: string, computeIndex: (index: number) => number): string[];

export function splitByIndex(value: string, indexOrComputeIndex: number | ((index: number) => number)): string[] {
  const expectedValueType = 'string';
  if (typeof value !== expectedValueType) {
    throw new Error(getInvalidValueTypeError({ value, expectedType: expectedValueType }));
  }

  const expectedIndexOrComputeIndexType = ['number', 'function'];
  if (!expectedIndexOrComputeIndexType.includes(typeof indexOrComputeIndex)) {
    throw new Error(getInvalidValueTypeError({ value, expectedType: expectedValueType }));
  }

  if (typeof indexOrComputeIndex === 'number') {
    const index = indexOrComputeIndex;

    const head = value.slice(0, index);
    const tail = value.slice(index);

    return [head, tail];
  }

  const slices = [];
  const computeIndex = indexOrComputeIndex;

  let position = 0;
  while (position < value.length) {
    const breakpoint = computeIndex(position);

    // if computeIndex always returns the same or lower value, or the value of an invalid type
    if (breakpoint <= position || typeof breakpoint !== 'number') {
      throw new Error(
        getInvalidValueError({
          value: computeIndex.toString().replaceAll('\n', '').slice(0, 50),
          name: 'computeIndex argument',
        })
      );
    }

    slices.push(value.slice(position, breakpoint));

    position = breakpoint;
  }

  return slices;
}
