import { type ComponentPropsWithRef, forwardRef } from "react";
import cn from "$/lib/utils/cn";
import Label, { type LabelProps } from "$/components/ui/form/label/label";

type InputProps = {
  leftIcon?: JSX.Element;
  rightElement?: JSX.Element;
  bare?: boolean;
  labelClassName?: string;
} & ComponentPropsWithRef<"input"> &
  Omit<LabelProps, "children">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      className,
      description,
      leftIcon,
      error,
      warning,
      rightElement,
      srOnly,
      labelClassName,
      ...props
    },
    ref
  ) => (
    <Label
      label={label}
      description={description}
      required={props.required}
      error={error}
      warning={warning}
      srOnly={srOnly}
      className={labelClassName}
    >
      <div className="relative flex items-center gap-2">
        {leftIcon !== undefined && (
          <div className="pointer-events-none absolute left-0 flex h-full w-10 items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          {...props}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-input-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon !== undefined && "pl-8",
            className
          )}
        />

        {rightElement !== undefined && rightElement}
      </div>
    </Label>
  )
);

Input.displayName = "Input";

export default Input;
