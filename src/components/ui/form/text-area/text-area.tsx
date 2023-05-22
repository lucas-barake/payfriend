import * as React from "react";
import { cn } from "$/lib/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const textAreaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      error: {
        true: "ring-2 ring-destructive focus:ring-destructive focus-visible:ring-destructive focus-visible:ring-offset-2",
      },
    },
  }
);

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textAreaVariants>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(textAreaVariants({ className, error }))}
        ref={ref}
        {...props}
      />
    );
  }
);
TextArea.displayName = "Textarea";

export { TextArea };
