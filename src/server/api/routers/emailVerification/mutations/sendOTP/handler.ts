import { protectedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import sendGridMail from "@sendgrid/mail";
import { env } from "$/env.mjs";
import { type MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { DateTime } from "luxon";
import handleMainError from "$/server/log/handleMainError";

const sendOTPHandler = protectedProcedure.mutation(async ({ ctx }) => {
  const isInSandBoxMode = env.SENDGRID_SANDBOX_MODE === "true";

  try {
    if (ctx.session.user.emailVerified != null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "El correo electrónico ya está verificado",
      });
    }

    if (ctx.session.user.email == null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Algún error ocurrió. Por favor, vuelve a intentarlo.",
      });
    }

    const lastOTPQuery = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        otpUpdatedAt: true,
      },
    });
    if (!lastOTPQuery) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No se encontró el usuario",
      });
    }

    const { otpUpdatedAt } = lastOTPQuery;
    if (otpUpdatedAt != null && !isInSandBoxMode) {
      const now = new Date();
      const diff = Math.abs(now.getTime() - otpUpdatedAt.getTime());
      const minutes = Math.floor(diff / 1000 / 60);
      const hasFiveMinutesPassed = minutes >= 5;

      if (!hasFiveMinutesPassed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Ya solicitaste un código de verificación. Por favor espera unos minutos y vuelve a intentarlo.",
        });
      }
    }

    const fourDigitGeneratedOTP = String(
      Math.floor(1000 + Math.random() * 9000)
    );
    const msg: MailDataRequired = {
      to: ctx.session.user.email,
      from: env.SENDGRID_FROM_EMAIL,
      subject: "Código de verificación para tu cuenta de Deudamigo",
      text: `Tu código de verificación es: ${fourDigitGeneratedOTP}`,
      html: `<strong>Tu código de verificación es: ${fourDigitGeneratedOTP}</strong>`,
      mailSettings: {
        sandboxMode: {
          enable: isInSandBoxMode,
        },
      },
    };

    if (isInSandBoxMode) {
      console.log(
        `Se envió el código de verificación ${fourDigitGeneratedOTP} a ${ctx.session.user.email}`
      );
    }

    sendGridMail.setApiKey(env.SENDGRID_API_KEY);
    void sendGridMail.send(msg);

    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        otp: fourDigitGeneratedOTP,
        otpUpdatedAt: DateTime.now().toUTC().toISO(),
      },
    });

    return true;
  } catch (error) {
    handleMainError(error);
  }
});

export default sendOTPHandler;
