import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { DesignLayout } from "$/components/layouts/design-layout";
import LoadingPage from "src/components/pages/loading-page";
import { Button } from "$/components/ui/button";
import { Pages } from "$/lib/enums/pages";
import { type NextPageWithLayout } from "$/pages/_app.page";
import { CustomHead } from "$/components/layouts/custom-head";
import React from "react";

const Home: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    void router.push(Pages.DASHBOARD);
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
            <Button
              onClick={() => {
                void signIn("google", {
                  callbackUrl: "/dashboard",
                  redirect: true,
                });
              }}
              size="lg"
              loading={session.status === "loading"}
            >
              Empezar ahora
            </Button>
          </div>
        </div>
      </div>
    </DesignLayout>
  );
};

Home.getLayout = (page) => {
  return (
    <React.Fragment>
      <CustomHead />
      {page}
    </React.Fragment>
  );
};

export default Home;
