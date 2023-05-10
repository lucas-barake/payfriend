import { type ComponentPropsWithRef, forwardRef } from "react";
import cn from "$/lib/utils/cn";

type CheckboxProps = {
  label: string;
  labelClassName?: string;
} & ComponentPropsWithRef<"input">;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, labelClassName, ...props }, ref) => (
    <label className={cn("flex items-center gap-1 capitalize", labelClassName)}>
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className={cn(
          "cursor-pointer p-2.5 accent-indigo-500 outline-none active:bg-indigo-500 dark:accent-indigo-500 dark:active:bg-indigo-400",
          className
        )}
      />
      {label}
    </label>
  )
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
