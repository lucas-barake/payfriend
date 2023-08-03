import React from "react";
import { cn } from "$/lib/utils/cn";

type Props = {
  containerClassName?: string;
  pingClassName?: string;
  indicatorClassName?: string;
};

export const AttentionIndicator: React.FC<Props> = ({
  indicatorClassName,
  pingClassName,
  containerClassName,
}) => (
  <span
    className={cn(
      "absolute right-0 top-0 z-50 -mr-1 -mt-1 flex h-3 w-3",
      containerClassName
    )}
  >
    <span
      className={cn(
        "absolute z-50 inline-flex h-full w-full animate-ping rounded-full bg-highlight opacity-75",
        pingClassName
      )}
    />
    <span
      className={cn(
        "relative inline-flex h-3 w-3 rounded-full bg-highlight",
        indicatorClassName
      )}
    />
  </span>
);
