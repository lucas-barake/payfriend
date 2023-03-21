import { type ComponentPropsWithRef, forwardRef } from "react";
import cs from "$/utils/cs";

type Props = {
  label: string;
  labelClassName?: string;
} & ComponentPropsWithRef<"input">;

// eslint-disable-next-line react/display-name
const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, className, labelClassName, ...props }, ref) => (
    <label className={cs("flex items-center gap-1 capitalize", labelClassName)}>
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className={cs(
          "cursor-pointer p-2.5 accent-indigo-500 outline-none active:bg-indigo-500 dark:accent-indigo-500 dark:active:bg-indigo-400",
          className
        )}
      />
      {label}
    </label>
  )
);

export default Checkbox;
