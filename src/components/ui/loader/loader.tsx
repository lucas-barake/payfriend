import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "$/lib/utils/cn";

export const loaderVariants = cva("animate-spin", {
  variants: {
    size: {
      small: "w-4 h-4",
      medium: "w-6 h-6",
      large: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

type Props = VariantProps<typeof loaderVariants> &
  React.SVGProps<SVGSVGElement>;

export const Loader = React.forwardRef<SVGSVGElement, Props>(
  ({ className, size, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn(loaderVariants({ size, className }))}
        {...props}
      />
    );
  }
);
Loader.displayName = "Loader";
