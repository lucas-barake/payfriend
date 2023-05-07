import React from "react";
import { View } from "$/pages/onboarding/(page-lib)/enums/view";
import { Controller, useForm } from "react-hook-form";
import {
  verifyOTPInput,
  type VerifyOTPInput,
} from "$/server/api/routers/user/otp/verify-otp/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { z } from "zod";
import { Form } from "$/components/ui/form";
import OTPInput from "react-otp-input";
import { Button } from "$/components/ui/button";

type Props = {
  setView: React.Dispatch<React.SetStateAction<View>>;
};

const OtpInput: React.FC<Props> = ({ setView }) => {
  const form = useForm<VerifyOTPInput>({
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(verifyOTPInput),
  });
  const verifyOTP = api.user.verifyPhoneOTP.useMutation();

  async function _verifyPhone(data: VerifyOTPInput): Promise<void> {
    await toast.promise(
      verifyOTP.mutateAsync({
        otp: data.otp,
      }),
      {
        loading: "Verificando...",
        success: () => {
          // Can't update user state without hard redirecting
          window.location.href = "/dashboard";
          return "¡Celular verificado!";
        },
        error: handleToastError,
      }
    );
  }

  return (
    <>
      <p className="text-center">
        Ingresa el código que te enviamos a tu celular
      </p>

      <Form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
        })}
      >
        <Controller
          control={form.control}
          name="otp"
          render={({ field }): JSX.Element => (
            <OTPInput
              value={field.value}
              onChange={(v): void => {
                if (z.coerce.number().safeParse(v).success) {
                  field.onChange(v);
                }
              }}
              numInputs={4}
              containerStyle="flex justify-center gap-4 px-2 text-center"
              inputStyle={{
                width: "3rem",
                height: "3rem",
              }}
              renderInput={(props): JSX.Element => (
                <input
                  {...props}
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{1}"
                  className="m-0 flex flex-col items-center justify-center rounded border border-gray-200 bg-white px-2 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1 dark:border-neutral-800 dark:bg-neutral-700"
                />
              )}
            />
          )}
        />

        {form.formState.errors.otp !== undefined && (
          <span className="text-center text-sm font-bold text-red-500">
            {form.formState.errors.otp.message}
          </span>
        )}

        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={(): void => setView(View.PHONE_INPUT)}
          >
            Regresar
          </Button>

          <Button variant="tertiary" type="submit" className="flex-1">
            Verificar
          </Button>
        </div>
      </Form>
    </>
  );
};

export default OtpInput;
