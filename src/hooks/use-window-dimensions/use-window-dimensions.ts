import { useCallback, useEffect, useState } from "react";

export type WindowDimensions = {
  width: number | null;
  height: number | null;
};

export function useWindowDimensions(): WindowDimensions {
  const hasWindow = typeof window !== "undefined";

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize(): void {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
    return undefined;
  }, [getWindowDimensions, hasWindow]);

  return windowDimensions;
}
