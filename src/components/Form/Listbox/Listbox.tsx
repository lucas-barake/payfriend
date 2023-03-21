import { type FC } from "react";
import { SelectorIcon } from "@heroicons/react/solid";
import { Listbox as HeadlessListbox } from "@headlessui/react";
import cs from "$/utils/cs";

type Props = {
  options: Array<{
    value: string;
    label: string;
  }>;
  value: string | undefined;
  displayValue: string | undefined;
  onChange: (value: string | undefined) => void;
};

const Listbox: FC<Props> = ({ options, onChange, value, displayValue }) => (
  <HeadlessListbox
    value={value}
    onChange={onChange}
    as="div"
    className="relative"
  >
    <HeadlessListbox.Button className="relative w-32 cursor-default rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-700 sm:text-sm">
      <span className="block truncate">{displayValue}</span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
    </HeadlessListbox.Button>

    <HeadlessListbox.Options className="w-42 absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-700 sm:text-sm">
      {options.map((option) => (
        <HeadlessListbox.Option key={option.value} value={option.value}>
          {({ selected, active }) => (
            <div
              className={cs(
                active ? "bg-indigo-600 text-white" : "text-gray-900",
                "relative cursor-default select-none py-2 pl-3 pr-9 dark:text-neutral-100"
              )}
            >
              <span
                className={`${
                  selected ? "font-semibold" : "font-normal"
                } block truncate`}
              >
                {option.label}
              </span>
            </div>
          )}
        </HeadlessListbox.Option>
      ))}
    </HeadlessListbox.Options>
  </HeadlessListbox>
);

export default Listbox;
