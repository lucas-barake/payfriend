import React from "react";
import { View } from "$/pages/onboarding/(page-lib)/enums/view";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { z } from "zod";
import { Form } from "$/components/ui/form";
import OTPInput from "react-otp-input";
import { Button } from "$/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useTimer } from "react-timer-hook";
import { DateTime, Duration } from "luxon";
import { minutesToMs } from "$/lib/utils/time/minutes-to-ms";
import {
  verifyPhoneInput,
  type VerifyPhoneInput,
} from "$/server/api/routers/user/phone/otp/verify-phone/input";

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

  const timer = useTimer({
    expiryTimestamp: DateTime.now().toJSDate(),
    autoStart: false,
  });
  const sendPhoneOtp = api.user.sendPhoneOtp.useMutation();
  const phoneOtpTtlQuery = api.user.getPhoneOtpTtl.useQuery(
    {
      phone: {
        phoneNumber: phone?.phoneNumber ?? "",
        countryCode: phone?.countryCode ?? "CO",
      },
    },
    {
      enabled: phone !== undefined,
      onSuccess({ ttlInSeconds }) {
        timer.restart(
          DateTime.now()
            .plus(Duration.fromObject({ seconds: ttlInSeconds }))
            .toJSDate()
        );
      },
      staleTime: minutesToMs(3),
    }
  );

  async function resendOtp(): Promise<void> {
    if (phone === undefined) {
      toast.error("No se pudo reenviar el código.");
      return;
    }

    await toast.promise(sendPhoneOtp.mutateAsync({ phone }), {
      loading: "Enviando código...",
      success: () => {
        void phoneOtpTtlQuery.refetch();
        return "¡Código enviado!";
      },
      error: handleToastError,
    });
  }

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
            onClick={() => {
              setView(View.PHONE_INPUT);
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>

          <Button variant="tertiary" type="submit" className="flex-1">
            Verificar
          </Button>
        </div>
      </Form>

      {timer.isRunning && (
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          El código de verificación caducará en {timer.minutes} minuto
          {timer.minutes === 1 ? "" : "s"} y {timer.seconds} segundo
          {timer.seconds === 1 ? "" : "s"}.
        </p>
      )}

      {!timer.isRunning && phoneOtpTtlQuery.data !== undefined && (
        <Button
          onClick={() => {
            void resendOtp();
          }}
          variant="outline"
          loading={sendPhoneOtp.isLoading}
        >
          Reenviar código
        </Button>
      )}
    </>
  );
};

export default OtpInput;
