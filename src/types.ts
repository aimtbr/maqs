export type TimeFormat = 12 | 24;

export type FormatMarkerGroupStrictSize<
  Length extends number,
  MarkerGroups extends string = keyof typeof FormatMarkerGroup
> = {
  [MarkerGroup in MarkerGroups]: MarkerGroup['length'] extends Length ? MarkerGroup : never;
};

type T = FormatMarkerGroupStrictSize<4>;
