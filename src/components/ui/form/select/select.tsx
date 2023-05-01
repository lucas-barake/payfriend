import { type ComponentPropsWithRef, forwardRef } from "react";
import cn from "$/utils/cn";
import Label, { type LabelProps } from "$/components/ui/form/label/label";

export type SelectProps = ComponentPropsWithRef<"select"> &
  Omit<LabelProps, "children">;

// eslint-disable-next-line react/display-name
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, description, error, warning, ...props }, ref) => (
    <Label
      required={props.required}
      description={description}
      label={label}
      error={error}
      warning={warning}
    >
      <select
        {...props}
        ref={ref}
        className={cn(
          "dark:border-dim-50 dark:bg-dim-50 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none dark:text-gray-100 dark:focus:border-indigo-400",
          className
        )}
      />
    </Label>
  )
);

export { Select };
