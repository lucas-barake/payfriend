import { type ComponentPropsWithRef, forwardRef } from "react";
import cs from "$/utils/cs";
import Label, { type LabelProps } from "$/components/Form/Label/Label";

type Props = {
  error?: string;
  tooltip?: string;
} & ComponentPropsWithRef<"textarea"> &
  Omit<LabelProps, "children">;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { label, className, description, error, warning, tooltip, ...props },
    ref
  ) => (
    <Label
      label={label}
      description={description}
      required={props.required}
      error={error}
      warning={warning}
    >
      <textarea
        ref={ref}
        className={cs(
          "block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none dark:border-neutral-800 dark:bg-neutral-700 dark:text-gray-100 dark:focus:border-indigo-400",
          className
        )}
        {...props}
        {...(tooltip !== undefined && { "data-tip": tooltip })}
      />
    </Label>
  )
);

Textarea.displayName = "Textarea";

export default Textarea;
