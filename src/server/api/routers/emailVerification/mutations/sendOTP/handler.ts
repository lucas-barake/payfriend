import { protectedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import sendGridMail from "@sendgrid/mail";
import { env } from "$/env.mjs";
import { type MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { DateTime } from "luxon";

const sendOTPHandler = protectedProcedure.mutation(async ({ ctx }) => {
  if (ctx.session.user.emailVerified != null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email already verified",
    });
  }

  if (ctx.session.user.email == null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email not found",
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
      message: "User not found",
    });
  }

  const { otpUpdatedAt } = lastOTPQuery;
  if (otpUpdatedAt != null) {
    const now = new Date();
    const diff = Math.abs(now.getTime() - otpUpdatedAt.getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    const hasFiveMinutesPassed = minutes >= 5;

    if (!hasFiveMinutesPassed) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "OTP already sent",
      });
    }
  }

  const fourDigitGeneratedOTP = Math.floor(1000 + Math.random() * 9000);
  sendGridMail.setApiKey(env.SENDGRID_API_KEY);

  const msg: MailDataRequired = {
    to: ctx.session.user.email,
    from: env.SENDGRID_FROM_EMAIL,
    subject: "Código de verificación para tu cuenta de Deudamigo",
    text: `Tu código de verificación es: ${fourDigitGeneratedOTP}`,
    html: `<strong>Tu código de verificación es: ${fourDigitGeneratedOTP}</strong>`,
  };

  void sendGridMail.send(msg);

  await ctx.prisma.user.update({
    where: { id: ctx.session.user.id },
    data: {
      otp: fourDigitGeneratedOTP,
      otpUpdatedAt: DateTime.now().toUTC().toISO(),
    },
  });

  return true;
});

export default sendOTPHandler;
