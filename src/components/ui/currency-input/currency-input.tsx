import React from "react";
import { type InputProps, inputVariants } from "$/components/ui/form/input";
import { type Currency } from "$/server/api/routers/debts/mutations/input";
import dynamic from "next/dynamic";

const IntlCurrencyInput = dynamic(
  // @ts-expect-error - No idea why this is happening
  () => import("react-intl-currency-input").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export type CurrencyInputOnChangeArgs = {
  event: React.ChangeEvent<HTMLInputElement>;
  value: number;
  maskedValue: string;
};
type Props = Omit<InputProps, "onChange"> & {
  currency: Currency;
  onChange: (args: CurrencyInputOnChangeArgs) => void;
};

export const CurrencyInput: React.FC<Props> = ({
  error,
  currency,
  className,
  onChange,
  ...props
}) => {
  const locale = navigator.language;

  return (
    <IntlCurrencyInput
      className={inputVariants({ error, className })}
      currency={currency}
      config={{
        // @ts-expect-error - Locale is typed as string, but it's actually the correct union type
        locale,
        formats: {
          number: {
            [currency]: {
              style: "currency",
              currency,
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
            },
          },
        },
      }}
      onChange={(
        event: CurrencyInputOnChangeArgs["event"],
        value: CurrencyInputOnChangeArgs["value"],
        maskedValue: CurrencyInputOnChangeArgs["maskedValue"]
      ) => {
        onChange({ event, value, maskedValue });
      }}
      {...props}
      type="tel"
    />
  );
};
