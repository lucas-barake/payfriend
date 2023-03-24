import { type FC, type ReactNode } from "react";
import AuthWrapper from "$/layouts/AuthWrapper";
import UserHeader from "$/layouts/UserHeader";
import Head from "next/head";

type Props = {
  children: ReactNode;
};

const AuthLayout: FC<Props> = ({ children }) => (
  <AuthWrapper>
    <Head>
      <title>Deudamigo</title>
      <meta
        name="description"
        content="Deudamigo es una aplicación gratuita que te ayuda a controlar y dividir las deudas con tus amigos y familiares. Crea grupos, añade gastos y liquida saldos fácilmente con Deudamigo."
      />
    </Head>

    <UserHeader />

    {children}
  </AuthWrapper>
);

export default AuthLayout;
