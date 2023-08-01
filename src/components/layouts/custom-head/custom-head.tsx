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
      : `${APP_NAME}: Comparte deudas y gastos fácilmente. Registra, rastrea y salda cuentas con amigos. ¡Simplifica tus deudas compartidas hoy!`;

  return (
    <Head>
      <title>{titleText}</title>
      <meta name="description" content={contentText} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export { CustomHead, type CustomHeadProps };
