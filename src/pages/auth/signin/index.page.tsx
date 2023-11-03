import { type NextPageWithLayout } from "$/pages/_app.page";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { authOptions } from "$/server/auth/auth";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import { Button } from "$/components/ui/button";
import { Pages } from "$/lib/enums/pages";
import { CustomHead } from "$/components/layouts/custom-head";
import { DesignLayout } from "$/components/layouts/design-layout";

type Providers = {
  google: {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session !== null) {
    return {
      redirect: {
        destination: Pages.DASHBOARD,
        permanent: false,
      },
    };
  }

  const providers = (await getProviders()) as Providers;

  return {
    props: {
      providers,
    },
  };
};

const SignIn: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  const { google } = providers;

  return (
    <div className="mt-48 flex flex-col items-center gap-2">
      <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground">
        Entra a tu cuenta
      </h1>

      <Button
        onClick={() => {
          void signIn(google.id);
        }}
        className="bg-white text-black hover:bg-gray-100"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 48 48"
          enableBackground="new 0 0 48 48"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          data-darkreader-inline-fill=""
          data-darkreader-inline-stroke=""
          className="mr-2 h-5 w-5"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            data-darkreader-inline-fill=""
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            data-darkreader-inline-fill=""
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            data-darkreader-inline-fill=""
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            data-darkreader-inline-fill=""
          />
        </svg>
        Iniciar sesión con {google.name}
      </Button>
    </div>
  );
};

SignIn.getLayout = (page) => (
  <DesignLayout>
    <CustomHead title="Iniciar Sesión" content="Inicia sesión en tu cuenta" />

    {page}
  </DesignLayout>
);

export default SignIn;
