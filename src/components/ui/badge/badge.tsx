import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "$/lib/utils/cn";
import { Slot } from "@radix-ui/react-slot";

const badgeVariants = cva(
  "inline-flex items-center justify-center border rounded-sm px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary/80 border-transparent text-primary-foreground",
        secondary:
          "bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground",
        destructive:
          "bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground",
        outline: "text-foreground",
        success:
          "bg-success hover:bg-success/80 border-transparent text-success-foreground",
        warning:
          "bg-warning hover:bg-warning/80 border-transparent text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariants };
