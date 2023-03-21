import type { FC } from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";
import cs from "$/utils/cs";

type StyledSwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

const StyledSwitch: FC<StyledSwitchProps> = ({
  checked: checkedValue,
  onChange,
  loading = false,
  disabled = false,
  className,
}) => {
  const isDisabled = disabled || loading;

  return (
    <HeadlessSwitch
      as="button"
      checked={checkedValue}
      onChange={onChange}
      disabled={loading || isDisabled}
      className={cs(
        loading
          ? "bg-green-600"
          : checkedValue
          ? "bg-indigo-600"
          : "bg-neutral-400 dark:bg-neutral-700",
        isDisabled && "cursor-not-allowed opacity-50",
        "focus:shadow-outline relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        className
      )}
    >
      {({ checked }) => (
        <span
          className={`${
            checked ? "translate-x-5" : "translate-x-0"
          } inline-block h-5 w-5 rounded-full bg-white transition duration-200 ease-in-out`}
        />
      )}
    </HeadlessSwitch>
  );
};

export default StyledSwitch;
