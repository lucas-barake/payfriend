import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DesignLayout from "$/layouts/DesignLayout";
import LoadingPage from "$/components/LoadingPage";

const Home: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    void router.push("/dashboard");
    return <LoadingPage />;
  }

  return (
    <DesignLayout>
      <div className="flex items-center justify-center">
        <div className="max-w-2xl py-32 text-center sm:py-48 lg:py-56">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-6xl">
            Controla tus <span className="text-indigo-500">deudas</span> con
            facilidad
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Crea y comparte tablas de deudas con tus amigos y familiares en
            cuestión de minutos
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => {
                void signIn("google", {
                  callbackUrl: "/dashboard",
                });
              }}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Empezar ahora
            </button>
          </div>
        </div>
      </div>
    </DesignLayout>
  );
};

export default Home;
