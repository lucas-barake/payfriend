import React from "react";
import { type SafeParseReturnType, type ZodType } from "zod";

type Args<T> = {
  key: string;
  defaultValues: T;
  validationSchema: ZodType<T>;
};

type UseStorageReturnType<T> = {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  reset: () => void;
};

export function createStorageHook(storage: Storage) {
  return function <T>(args: Args<T>): UseStorageReturnType<T> {
    const storedValue = storage.getItem(args.key);
    let initial: T = args.defaultValues;

    if (storedValue !== null) {
      const parsed: SafeParseReturnType<T, T> = args.validationSchema.safeParse(
        JSON.parse(storedValue)
      );
      if (parsed.success) {
        initial = parsed.data;
      }
    }

    const [state, setState] = React.useState<T>(initial);

    return {
      state,
      setState: (action: React.SetStateAction<T>) => {
        setState((prevState) => {
          const newState =
            typeof action === "function"
              ? (action as (prevState: T) => T)(prevState)
              : action;
          storage.setItem(args.key, JSON.stringify(newState));
          return newState;
        });
      },
      reset: () => {
        storage.removeItem(args.key);
        setState(args.defaultValues);
      },
    };
  };
}
