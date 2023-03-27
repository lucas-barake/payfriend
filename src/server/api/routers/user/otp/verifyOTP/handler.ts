import { protectedProcedure } from "$/server/api/trpc";
import { DateTime } from "luxon";
import { verifyOTPInput } from "$/server/api/routers/user/otp/verifyOTP/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const verifyOTP = protectedProcedure
  .input(verifyOTPInput)
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.emailVerified != null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El email ya está verificado");
    }

    const userQuery = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        otp: true,
        otpUpdatedAt: true,
      },
    });

    if (!userQuery) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró el usuario");
    }

    if (userQuery.otp == null || userQuery.otpUpdatedAt == null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("Solicita el código de verificación");
    }

    if (userQuery.otp !== input.otp) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El código es inválido");
    }

    const now = new Date();
    const diff = Math.abs(now.getTime() - userQuery.otpUpdatedAt.getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    const hasFifteenMinutesPassed = minutes >= 15;

    if (hasFifteenMinutesPassed) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El código expiró. Solicita uno nuevo."
      );
    }

    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        otp: null,
        otpUpdatedAt: null,
        emailVerified: DateTime.now().toUTC().toISO(),
      },
    });

    return true;
  });

export default verifyOTP;
