import { type ComponentPropsWithRef, forwardRef } from "react";
import { cn } from "$/lib/utils/cn";

export type SelectProps = ComponentPropsWithRef<"select">;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      {...props}
      ref={ref}
      className={cn(
        "dark:border-dim-50 dark:bg-dim-50 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none dark:text-gray-100 dark:focus:border-indigo-400",
        className
      )}
    />
  )
);
Select.displayName = "Select";

export { Select };
