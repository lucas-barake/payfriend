import React from "react";
import { cn } from "$/lib/utils/cn";

type Props = {
  children: React.ReactNode | null | undefined;
} & React.ComponentPropsWithRef<"p">;

export const FieldError = React.forwardRef<HTMLParagraphElement, Props>(
  ({ children, className, ...props }, ref) => {
    if (!children) return null;

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
