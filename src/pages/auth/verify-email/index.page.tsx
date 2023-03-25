import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "$/components/LoadingPage";
import DesignLayout from "$/layouts/DesignLayout";
import Button from "$/components/Button";
import { CheckIcon, MailIcon } from "@heroicons/react/outline";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import OtpInput from "react-otp-input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type VerifyOTPInput,
  verifyOTPInput,
} from "$/server/api/routers/emailVerification/mutations/verifyOTP/input";
import Form from "$/components/Form";
import { z } from "zod";

const VerifyEmailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/");
    },
  });

  const form = useForm<VerifyOTPInput>({
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(verifyOTPInput),
  });

  const sendVerificationEmailMutation =
    api.emailVerification.sendVerificationEmail.useMutation();
  const verifyEmailMutation = api.emailVerification.verifyOTP.useMutation();

  if (session.data?.user?.emailVerified) {
    void router.push("/dashboard");
    return <LoadingPage />;
  }

  async function sendVerificationEmail(): Promise<void> {
    await toast.promise(sendVerificationEmailMutation.mutateAsync(), {
      loading: "Enviando código...",
      success: "Código enviado",
      error: handleToastError,
    });
  }

  async function verifyEmail(data: VerifyOTPInput): Promise<void> {
    await toast.promise(
      verifyEmailMutation.mutateAsync({
        otp: data.otp,
      }),
      {
        loading: "Verificando...",
        success: () => {
          window.location.href = "/dashboard";
          return "¡Correo verificado!";
        },
        error: handleToastError,
      }
    );
  }

  return (
    <DesignLayout showSignOut>
      <div className="flex items-center justify-center">
        <div className="flex max-w-2xl flex-col items-center justify-center gap-4 py-32 sm:py-48 lg:py-56">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-6xl">
            Verifica tu <span className="text-indigo-500">correo</span>
          </h1>

          <div className="flex flex-col items-center gap-4 text-lg text-gray-500 dark:text-neutral-300">
            <p className="text-center">
              Haz clic en el botón de abajo para recibir un código de
              verificación por correo electrónico, que necesitarás para
              completar la creación de tu cuenta.
            </p>

            <Button
              color="emerald"
              noPadding
              className="flex items-center gap-2 px-2 py-1"
              loading={sendVerificationEmailMutation.isLoading}
              onClick={() => {
                void sendVerificationEmail();
              }}
            >
              <MailIcon className="h-6 w-6" />
              Enviar Código
            </Button>
          </div>

          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Form onSubmit={form.handleSubmit(verifyEmail)} className="my-4">
            <Controller
              control={form.control}
              name="otp"
              render={({ field }) => (
                <OtpInput
                  value={field.value}
                  onChange={(v) => {
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
                  renderInput={(props) => (
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

            <div className="mt-2 flex items-center justify-center">
              <Button
                color="indigo"
                className="flex items-center gap-2 self-center"
                loading={verifyEmailMutation.isLoading}
                type="submit"
              >
                <CheckIcon className="h-6 w-6" />
                Verificar
              </Button>
            </div>
          </Form>

          <span className="text-center text-gray-500 dark:text-neutral-300">
            Si no te aparece el correo revisa tu carpeta de{" "}
            <span className="font-bold text-orange-500">spam</span>
          </span>
        </div>
      </div>
    </DesignLayout>
  );
};

VerifyEmailPage.getLayout = (page) => <>{page}</>;

export default VerifyEmailPage;
