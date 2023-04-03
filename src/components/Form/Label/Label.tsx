import { type ComponentPropsWithoutRef, type FC, type ReactNode } from "react";
import cs from "$/utils/cs";
import RequiredStar from "$/components/Form/RequiredStar";

export type LabelProps = {
  required?: boolean;
  children: ReactNode;
  description?: string;
  warning?: string;
  error?: string;
  label: string;
  srOnly?: boolean;
};

const Label: FC<LabelProps & ComponentPropsWithoutRef<"label">> = ({
  children,
  label,
  required = false,
  description,
  className,
  warning,
  error,
  srOnly = false,
  ...props
}) => (
  <label
    className={cs(
      "flex flex-col gap-1 font-medium dark:text-gray-100",
      className
    )}
    {...props}
  >
    {srOnly ? (
      <span className="sr-only">{label}</span>
    ) : required ? (
      <div className="flex flex-col">
        <div className="flex items-center gap-1 capitalize">
          {label}
          <RequiredStar />
        </div>
        {description !== undefined && (
          <p className="text-sm normal-case">{description}</p>
        )}
      </div>
    ) : (
      <div className="flex flex-col">
        <span className="capitalize">{label}</span>

        {description !== undefined && (
          <p className="text-sm normal-case">{description}</p>
        )}
      </div>
    )}

    {children}

    {error !== undefined && (
      <p className="text-sm font-medium text-red-500">{error}</p>
    )}
    {warning !== undefined && (
      <p className="text-sm font-medium text-orange-500 dark:text-amber-500">
        {warning}
      </p>
    )}
  </label>
);

export default Label;
