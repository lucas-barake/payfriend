import { protectedProcedure } from "$/server/api/trpc";
import sendGridMail, { type MailDataRequired } from "@sendgrid/mail";
import { env } from "$/env.mjs";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import TimeInMs from "$/lib/enums/time-in-ms";
import { emailCodeKey } from "$/server/api/routers/user/email-otp/lib/email-code-key";
import { APP_NAME } from "$/lib/constants/app-name";

const sendEmailOTP = protectedProcedure.mutation(async ({ ctx }) => {
  const isInSandBoxMode = env.SENDGRID_SANDBOX_MODE;

  if (ctx.session.user.emailVerified !== null) {
    throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
      "El correo electrónico ya está verificado"
    );
  }

  if (ctx.session.user.email === null || ctx.session.user.email === undefined) {
    throw CUSTOM_EXCEPTIONS.BAD_REQUEST();
  }

  const codeExists = await ctx.redis.exists(
    `${emailCodeKey}:${ctx.session.user.email}`
  );
  if (codeExists) {
    throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
      "Ya se envió un código de verificación a tu correo electrónico. Por favor espera unos minutos y vuelve a intentarlo."
    );
  }

  const fourDigitGeneratedCode = String(
    Math.floor(1000 + Math.random() * 9000)
  );
  const msg = {
    to: ctx.session.user.email ?? undefined,
    from: env.SENDGRID_FROM_EMAIL,
    subject: `Código de verificación para tu cuenta de ${APP_NAME}`,
    text: `Tu código de verificación es: ${fourDigitGeneratedCode}`,
    html: `<strong>Tu código de verificación es: ${fourDigitGeneratedCode}</strong>`,
    mailSettings: {
      sandboxMode: {
        enable: isInSandBoxMode,
      },
    },
  } satisfies MailDataRequired;

  if (isInSandBoxMode) {
    console.log(
      `Se envió el código de verificación ${fourDigitGeneratedCode} a ${
        ctx.session.user.email ?? "undefined"
      }`
    );
  }

  sendGridMail.setApiKey(env.SENDGRID_API_KEY);
  void sendGridMail.send(msg);

  await ctx.redis.set(
    `${emailCodeKey}:${ctx.session.user.email}`,
    fourDigitGeneratedCode,
    "EX",
    TimeInMs.FiveMinutes
  );

  return true;
});

export { sendEmailOTP };
