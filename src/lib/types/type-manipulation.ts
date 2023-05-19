export type Modify<T, R> = Omit<T, keyof R> & R;
export type Neverify<T> = { [P in keyof T]: never };
export type Nullify<T> = { [P in keyof T]: null };
