import React, { type ComponentPropsWithRef } from "react";
import { cn } from "$/lib/utils/cn";

type Props = ComponentPropsWithRef<"p"> & {
  hide?: boolean;
};

export const FieldDescription = React.forwardRef<HTMLParagraphElement, Props>(
  ({ children, hide = false, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", hide && "hidden")}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FieldDescription.displayName = "FieldDescription";
