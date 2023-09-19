import {
  FormatMarkerGroupLevelDictionary,
  FormatMarkerGroupLevel,
  FormatMarkerGroupParamsMap,
} from 'src/entities/Settings/constants';

export const getMarkerGroupByLevel = <L extends FormatMarkerGroupLevel>(
  level: L
): FormatMarkerGroupLevelDictionary[L] => {
  return Object.entries(FormatMarkerGroupParamsMap).reduce<FormatMarkerGroupLevelDictionary[L]>(
    (accumulator, [markerGroup, markerGroupParams]) =>
      markerGroup.length === level ? { ...accumulator, [markerGroup]: markerGroupParams } : accumulator,
    {}
  );
};
