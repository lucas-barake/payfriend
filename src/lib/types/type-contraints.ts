export type NonEmptyArray<T> = [T, ...T[]];
export type NonEmptyObject<T> = { [K in keyof T]: T[K] };
export type NonNegativeInteger<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `${string}.${string}`
  ? never
  : T;
