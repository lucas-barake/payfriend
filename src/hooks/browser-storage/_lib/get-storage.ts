/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStorage(type: "session" | "local"): Storage {
  if (isBrowser()) {
    return type === "session" ? window.sessionStorage : window.localStorage;
  }

  // Dummy storage for server-side to avoid errors
  return {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => {},
    removeItem: (key: string) => {},
    clear: () => {},
    length: 0,
    key: (index: number) => null,
  };
}
