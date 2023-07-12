// eslint-disable-next-line no-use-before-define
export type DeepReadonlyArray<T> = object & ReadonlyArray<DeepReadonly<T>>;

export type DeepReadonly<T> = T extends Array<infer R>
  ? DeepReadonlyArray<R>
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Function
  ? T
  : T extends object
  ? // eslint-disable-next-line no-use-before-define
    DeepReadonlyObject<T>
  : T;

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
