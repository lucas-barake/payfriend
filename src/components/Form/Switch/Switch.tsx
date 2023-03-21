import type { ComponentPropsWithoutRef, FC } from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";
import cs from "$/utils/cs";
import StyledSwitch from "$/components/Form/Switch/StyledSwitch/StyledSwitch";

type Props = {
  switchClassName?: string;
  label?: string;
} & ComponentPropsWithoutRef<typeof StyledSwitch>;

const Switch: FC<Props> = ({
  checked: checkedValue,
  onChange,
  className,
  switchClassName,
  label,
  loading = false,
  disabled = false,
}) => (
  <>
    {label !== undefined ? (
      <HeadlessSwitch.Group
        as="div"
        className={cs("flex cursor-pointer items-center", className)}
      >
        <HeadlessSwitch.Label
          as="span"
          className="mr-3 font-medium text-gray-700 dark:text-neutral-100"
        >
          {label}
        </HeadlessSwitch.Label>

        <StyledSwitch
          checked={checkedValue}
          onChange={onChange}
          loading={loading}
          disabled={disabled}
          className={switchClassName}
        />
      </HeadlessSwitch.Group>
    ) : (
      <StyledSwitch
        checked={checkedValue}
        onChange={onChange}
        loading={loading}
        disabled={disabled}
        className={switchClassName}
      />
    )}
  </>
);

export default Switch;
