import { type ComponentPropsWithRef, forwardRef } from "react";
import cn from "$/utils/cn";
import Label, { type LabelProps } from "$/components/ui/form/label/label";

type Props = ComponentPropsWithRef<"textarea"> & Omit<LabelProps, "children">;

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
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
          "block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none dark:border-neutral-800 dark:bg-neutral-700 dark:text-gray-100 dark:placeholder-neutral-400/75 dark:focus:border-indigo-400",
          className
        )}
        {...props}
      />
    </Label>
  )
);

TextArea.displayName = "TextArea";

export default TextArea;
