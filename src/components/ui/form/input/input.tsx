import { type ComponentPropsWithRef, forwardRef } from "react";
import cn from "$/utils/cn";
import Label, { type LabelProps } from "$/components/ui/form/label/label";

type InputProps = {
  leftIcon?: JSX.Element;
  rightElement?: JSX.Element;
  noWidth?: boolean;
  bare?: boolean;
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
      noWidth = false,
      srOnly,
      bare = false,
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
            "bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 placeholder-gray-400/90 transition ease-in-out focus:text-gray-700 focus:outline-none dark:text-gray-100 dark:placeholder-neutral-400/75",
            bare
              ? ""
              : "rounded border border-solid border-gray-300 focus:border-indigo-600 dark:border-neutral-800 dark:bg-neutral-700 dark:focus:border-indigo-400",
            !noWidth && "w-full",
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
