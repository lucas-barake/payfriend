import { type FC } from "react";
import { SelectorIcon } from "@heroicons/react/solid";
import { Listbox as HeadlessListbox } from "@headlessui/react";
import cn from "$/utils/cn";

type Option = {
  value: string;
  label: string | undefined;
};
export type ListBoxOptions = Option[] | Readonly<Option[]>;
export type ListBoxProps = {
  buttonClassName?: string;
  options: ListBoxOptions;
  value: string | undefined;
  displayValue: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
};

const ListBox: FC<ListBoxProps> = ({
  options,
  onChange,
  value,
  displayValue,
  buttonClassName,
  disabled = false,
}) => (
  <HeadlessListbox
    value={value}
    onChange={onChange}
    as="div"
    className={cn("relative", disabled && "cursor-not-allowed opacity-50")}
    disabled={disabled}
  >
    <HeadlessListbox.Button
      className={cn(
        "relative w-28 cursor-default rounded border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-left focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-700 sm:py-2 sm:text-sm lg:w-32 xl:w-36 2xl:w-40",
        buttonClassName
      )}
    >
      <span className="block truncate">{displayValue}</span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
    </HeadlessListbox.Button>

    <HeadlessListbox.Options className="absolute z-10 mt-1 max-h-60 w-40 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-700 sm:text-sm">
      {options.map((option) => (
        <HeadlessListbox.Option key={option.value} value={option.value}>
          {({ selected, active }) => (
            <div
              className={cn(
                active ? "bg-indigo-600 text-white" : "text-gray-900",
                "relative cursor-default select-none py-2 pl-3 pr-9 dark:text-neutral-100"
              )}
            >
              <span
                className={`${
                  selected ? "font-semibold" : "font-normal"
                } block truncate`}
              >
                {option.label ?? option.value}
              </span>
            </div>
          )}
        </HeadlessListbox.Option>
      ))}
    </HeadlessListbox.Options>
  </HeadlessListbox>
);

export default ListBox;
