import { type FC } from "react";
import Head from "next/head";
import { APP_NAME } from "$/lib/constants/app-name";

type CustomHeadProps = {
  title?: string;
  content?: string;
};

const CustomHead: FC<CustomHeadProps> = ({ title, content }) => {
  const titleText = title !== undefined ? `${title} | ${APP_NAME}` : APP_NAME;
  const contentText =
    content !== undefined
      ? content
      : `${APP_NAME} es una aplicación gratuita que te ayuda a controlar y dividir las deudas con tus amigos y familiares. Crea grupos, añade gastos y liquida saldos fácilmente con ${APP_NAME}.`;

  return (
    <Head>
      <title>{titleText}</title>
      <meta name="description" content={contentText} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export { CustomHead, type CustomHeadProps };
