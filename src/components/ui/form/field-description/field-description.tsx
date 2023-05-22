import React, { type ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"p">;

export const FieldDescription = React.forwardRef<HTMLParagraphElement, Props>(
  ({ children, ...props }, ref) => {
    return (
      <p ref={ref} className="text-sm text-muted-foreground" {...props}>
        {children}
      </p>
    );
  }
);
FieldDescription.displayName = "FieldDescription";
