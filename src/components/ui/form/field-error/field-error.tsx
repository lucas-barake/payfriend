import React from "react";
import { cn } from "$/lib/utils/cn";

type Props = {
  children: React.ReactNode | null | undefined;
  hide?: unknown;
} & React.ComponentPropsWithRef<"p">;

export const FieldError = React.forwardRef<HTMLParagraphElement, Props>(
  ({ children, className, hide, ...props }, ref) => {
    if (!children) return null;
    if (Boolean(hide)) return null;

    return (
      <p
        className={cn("text-sm font-semibold text-destructive", className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";
