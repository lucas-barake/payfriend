import React from "react";
import { View } from "$/pages/onboarding/(page-lib)/enums/view";
import { Controller, useForm } from "react-hook-form";
import {
  verifyPhoneInput,
  type VerifyPhoneInput,
} from "$/server/api/routers/user/phone/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { z } from "zod";
import { Form } from "$/components/ui/form";
import OTPInput from "react-otp-input";
import { Button } from "$/components/ui/button";
import { ChevronLeft } from "lucide-react";

type Props = {
  setView: React.Dispatch<React.SetStateAction<View>>;
  phone: VerifyPhoneInput["phone"] | undefined;
};

const OtpInput: React.FC<Props> = ({ setView, phone }) => {
  const form = useForm<VerifyPhoneInput>({
    defaultValues: {
      phone,
      otp: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(verifyPhoneInput),
  });
  const verifyPhoneMutation = api.user.verifyPhone.useMutation();

  async function verifyPhone(input: VerifyPhoneInput): Promise<void> {
    await toast.promise(verifyPhoneMutation.mutateAsync(input), {
      loading: "Verificando...",
      success: () => {
        // Can't update user state without hard redirecting
        window.location.href = "/dashboard";
        return "¡Celular verificado!";
      },
      error: handleToastError,
    });
  }

  return (
    <>
      <p className="text-center">
        ¡Perfecto! Hemos enviado un código a tu número de celular. Si aún no lo
        has recibido, espera un momento más. Una vez que lo tengas, ingrésalo
        aquí para verificar tu celular.
      </p>

      <Form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(verifyPhone)}
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
            <ChevronLeft className="mr-2 h-4 w-4" />
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
