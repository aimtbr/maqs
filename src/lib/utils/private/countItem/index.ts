/**
 * Return the number of `item`s in the `list`.
 */
export const countItem = (item: unknown, list: Iterable<unknown>): number => {
  return Array.prototype.filter.call(list, (listItem) => Object.is(listItem, item)).length;
};
