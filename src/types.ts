export type TimeFormat = 12 | 24;

export enum FormatMarker {
  Y,
  M,
  D,
  d,
  H,
  h,
  m,
  S,
  s,
  A,
  a,
}

export type FormatMarkerGroupStrict<
  Length extends number,
  MarkerGroups extends string[] = (keyof typeof FormatMarkerGroup)[]
> = MarkerGroups[number]['length'] extends Length ? MarkerGroups[number] : never;

type T = FormatMarkerGroupStrict<3>;
export enum FormatMarkerGroup {
  YYYY,
  YY,
  MMMM,
  MMM,
  MM,
  M,
  DD,
  D,
  dddd,
  ddd,
  HH,
  hh,
  h,
  mm,
  m,
  ss,
  s,
  SSS,
  A,
  a,
}
