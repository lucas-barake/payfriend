import { type FC, useState } from "react";
import Button from "$/components/Button";
import OTPInput from "$/components/AuthWrapper/VerifyEmail/OTPInput";
import DesignLayout from "$/layouts/DesignLayout";
import { CheckIcon } from "@heroicons/react/outline";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { useRouter } from "next/router";

const VerifyEmail: FC = () => {
  const router = useRouter();
  const sendVerificationEmailMutation =
    api.emailVerification.sendVerificationEmail.useMutation();
  const verifyEmailMutation = api.emailVerification.verifyOTP.useMutation();
  const [values, setValues] = useState<string[]>(Array(4).fill(""));

  async function sendVerificationEmail(): Promise<void> {
    await toast.promise(sendVerificationEmailMutation.mutateAsync(), {
      loading: "Enviando código...",
      success: "Código enviado",
      error: handleToastError,
    });
  }

  async function verifyEmail(): Promise<void> {
    const otp = values.join("");
    await toast.promise(
      verifyEmailMutation.mutateAsync({
        otp: Number(otp),
      }),
      {
        loading: "Verificando...",
        success: () => {
          void router.push("/dashboard");
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

          <p className="flex flex-col items-center gap-4 text-lg text-gray-500 dark:text-neutral-300 sm:flex-row">
            ¿No has solicitado el código?
            <Button
              color="emerald"
              noPadding
              className="flex items-center gap-2 px-2 py-1"
              loading={sendVerificationEmailMutation.isLoading}
              onClick={() => {
                void sendVerificationEmail();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Enviar Código
            </Button>
          </p>

          <OTPInput values={values} setValues={setValues} />

          <Button
            color="indigo"
            className="flex items-center gap-2"
            loading={verifyEmailMutation.isLoading}
            onClick={() => {
              void verifyEmail();
            }}
          >
            <CheckIcon className="h-6 w-6" />
            Verificar
          </Button>

          <span className="text-center text-sm text-gray-500 dark:text-neutral-300">
            Si no te aparece el correo revisa tu carpeta de{" "}
            <span className="font-bold text-orange-500">spam</span>
          </span>
        </div>
      </div>
    </DesignLayout>
  );
};

export default VerifyEmail;
