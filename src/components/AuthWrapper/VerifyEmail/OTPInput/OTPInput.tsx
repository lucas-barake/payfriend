import React, { type FC } from "react";

type Props = {
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
};
const OTPInput: FC<Props> = ({ values, setValues }) => {
  const amount = values.length;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void {
    const value = e.target.value;

    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    // if there is a next input and the value is not empty, focus on it
    if (index < amount - 1 && value) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void {
    const keyCode = e.keyCode;

    // if backspace or delete is pressed and the current input is empty, focus on previous input
    if ((Number(keyCode) === 8 || Number(keyCode) === 46) && !values[index]) {
      e.preventDefault();
      if (index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  }

  return (
    <div className="my-4 flex justify-center gap-4 px-2 text-center">
      {Array.from({ length: amount }, (_, i) => (
        <input
          id={`otp-input-${i}`}
          key={i}
          className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-2 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1 dark:border-neutral-800 dark:bg-neutral-700"
          type="text"
          maxLength={1}
          value={values[i]}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
