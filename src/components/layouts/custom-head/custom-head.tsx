import { type FC } from "react";
import Head from "next/head";

type CustomHeadProps = {
  title?: string;
  content?: string;
};

const CustomHead: FC<CustomHeadProps> = ({ title, content }) => {
  const titleText = title !== undefined ? `${title} | Deudamigo` : "Deudamigo";
  const contentText =
    content !== undefined
      ? content
      : "Deudamigo es una aplicación gratuita que te ayuda a controlar y dividir las deudas con tus amigos y familiares. Crea grupos, añade gastos y liquida saldos fácilmente con Deudamigo.";

  return (
    <Head>
      <title>{titleText}</title>
      <meta name="description" content={contentText} />
    </Head>
  );
};

export { CustomHead, type CustomHeadProps };
