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
      "absolute right-0 top-0 -mr-1 -mt-1 flex h-3 w-3",
      containerClassName
    )}
  >
    <span
      className={cn(
        "absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-700 opacity-75 dark:bg-yellow-300",
        pingClassName
      )}
    />
    <span
      className={cn(
        "relative inline-flex h-3 w-3 rounded-full bg-orange-600 dark:bg-yellow-400",
        indicatorClassName
      )}
    />
  </span>
);
