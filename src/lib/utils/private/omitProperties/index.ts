export function omitProperties<K extends string | number | symbol, R extends Record<K, unknown>>(
  propertyKey: K,
  structure: R
): R;
export function omitProperties<K extends string | number | symbol, R extends Record<K, unknown>>(
  propertyKeys: K[],
  structure: R
): R;

export function omitProperties<K extends string | number | symbol, R extends Record<K, unknown>>(
  propertyKeyOrKeys: K,
  structure: R
): R {
  const structureClone = { ...structure };

  if (Array.isArray(propertyKeyOrKeys)) {
    propertyKeyOrKeys.forEach((propertyKey: K) => {
      if (propertyKey in structureClone) {
        delete structureClone[propertyKey];
      }
    });

    return structureClone;
  }

  if (propertyKeyOrKeys in structureClone) {
    delete structureClone[propertyKeyOrKeys];
  }

  return structureClone;
}
