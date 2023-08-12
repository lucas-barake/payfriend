import React from "react";
import { type InputProps, inputVariants } from "$/components/ui/form/input";
import IntlCurrencyInput from "react-intl-currency-input";
import { type Currency } from "$/server/api/routers/debts/create-debt/input";
import dynamic from "next/dynamic";

export type CurrencyInputOnChangeArgs = {
  event: React.ChangeEvent<HTMLInputElement>;
  value: number;
  maskedValue: string;
};
type Props = Omit<InputProps, "onChange"> & {
  currency: Currency;
  onChange: (args: CurrencyInputOnChangeArgs) => void;
};

export const Base: React.FC<Props> = ({
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
        // @ts-expect-error - The type definitions for react-intl-currency-input are wrong
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
    />
  );
};

export const CurrencyInput = dynamic(() => Promise.resolve(Base), {
  ssr: false,
});
