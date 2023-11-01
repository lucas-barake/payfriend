import { type AppProps } from "next/app";
import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { api } from "$/lib/utils/api";
import "$/styles/globals.css";
import { StyledToaster } from "src/components/ui/styled-toaster";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "$/lib/utils/apollo-client";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: { session: Session | null };
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout): JSX.Element => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session as Session | null}>
      <ApolloProvider client={apolloClient}>
        <StyledToaster />
        <ThemeProvider attribute="class">
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
