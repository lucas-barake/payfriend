import { type ComponentPropsWithRef, forwardRef } from "react";
import cn from "$/lib/utils/cn";
import Label, { type LabelProps } from "$/components/ui/form/label/label";

export type TextAreaProps = ComponentPropsWithRef<"textarea"> &
  Omit<LabelProps, "children">;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { label, className, description, error, warning, srOnly, ...props },
    ref
  ) => (
    <Label
      label={label}
      description={description}
      required={props.required}
      error={error}
      warning={warning}
      srOnly={srOnly}
    >
      <textarea
        ref={ref}
        className={cn(
          "flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-input-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </Label>
  )
);

TextArea.displayName = "TextArea";

export { TextArea };
