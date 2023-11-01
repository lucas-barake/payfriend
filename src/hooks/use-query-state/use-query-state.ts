import React from "react";
import { type ZodType } from "zod";
import { useRouter } from "next/router";

type Args<T> = {
  validationSchema: ZodType<T>;
  defaultValues: T;
};

export function useQueryState<T extends object>(
  config: Args<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const router = useRouter();

  function convertToQueryParams(state: T): string {
    return new URLSearchParams(
      state as unknown as Record<string, string>
    ).toString();
  }

  function convertToState(query: Record<string, unknown>): T {
    const state: Partial<T> = { ...config.defaultValues };
    for (const key in query) {
      if (key in config.defaultValues) {
        state[key as keyof T] = query[key] as T[keyof T];
      }
    }
    return state as T;
  }

  const parsedState = config.validationSchema.safeParse(
    convertToState(router.query)
  );
  const initialState = parsedState.success
    ? parsedState.data
    : config.defaultValues;
  const [state, setState] = React.useState<T>(initialState);

  function setQueryState(newState: React.SetStateAction<T>): void {
    const nextState =
      typeof newState === "function"
        ? (newState as (prevState: T) => T)(state)
        : newState;

    const parsedNextState = config.validationSchema.safeParse(nextState);
    if (parsedNextState.success) {
      setState(parsedNextState.data);
      void router.push({
        pathname: router.pathname,
        query: convertToQueryParams(parsedNextState.data),
      });
    }
  }

  return [state, setQueryState];
}
