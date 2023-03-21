import { type ComponentPropsWithRef, forwardRef } from "react";
import cs from "$/utils/cs";
import Label, { type LabelProps } from "$/components/Form/Label/Label";

type InputProps = {
  leftIcon?: JSX.Element;
  dark?: boolean;
  rightElement?: JSX.Element;
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
      dark = false,
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
          className={cs(
            "w-full rounded border border-solid bg-clip-padding px-3 py-1.5 text-base font-normal transition ease-in-out focus:border-indigo-600 focus:outline-none dark:border-neutral-800 dark:bg-neutral-700 dark:text-gray-100 dark:placeholder-neutral-400/75 dark:focus:border-indigo-400",
            leftIcon !== undefined && "pl-8",
            dark
              ? "border-dim-50 bg-dim-50 text-gray-100 placeholder-neutral-400/75 focus:border-indigo-400"
              : "border-gray-300 bg-white text-gray-700 placeholder-gray-400/90 focus:border-indigo-600 focus:bg-white focus:text-gray-700",
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
