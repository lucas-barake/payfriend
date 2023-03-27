export type Neverify<T> = T extends object
  ? { [K in keyof T]: Neverify<T[K]> }
  : never;
