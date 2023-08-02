import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { env } from "$/env.mjs";
import { APP_NAME } from "$/lib/constants/app-name";
import { Pages } from "$/lib/enums/pages";

const baseUrl = env.VERCEL_URL
  ? `https://${env.VERCEL_URL}`
  : "https://localhost:3000";

type Props = {
  debtName: string | null;
  inviterEmail: string;
  inviterName: string | null | undefined;
  inviteeEmail: string;
};

export const InvitationEmail: React.FC<Readonly<Props>> = ({
  debtName,
  inviterName,
  inviteeEmail,
  inviterEmail,
}) => {
  const previewText = `Te invitaron a ${
    debtName ?? "una deuda"
  } en ${APP_NAME}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Únete a <strong>{debtName ?? "una deuda"}</strong> en{" "}
              <strong>{APP_NAME}</strong>
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              Hola {inviteeEmail.split("@")[0]},
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{inviterName ?? inviterEmail.split("@")[0]}</strong> (
              <Link
                href={`mailto:${inviterEmail}`}
                className="text-blue-600 no-underline"
              >
                {inviterEmail}
              </Link>
              ) te invitó a unirte a{" "}
              {debtName === null ? (
                "una deuda"
              ) : (
                <>
                  la deuda <strong>{debtName}</strong>
                </>
              )}{" "}
              en <strong>{APP_NAME}</strong>.
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-indigo-600 text-center text-[12px] font-semibold text-white no-underline"
                href={`${baseUrl}/${Pages.DASHBOARD}`}
              >
                Aceptar invitación
              </Button>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Si no esperabas esta invitación, puedes ignorar este correo
              electrónico.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
