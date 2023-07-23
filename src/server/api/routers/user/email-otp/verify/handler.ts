import { TRPCProcedures } from "$/server/api/trpc";
import { DateTime } from "luxon";
import { verifyEmailInput } from "$/server/api/routers/user/email-otp/verify/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { emailCodeKey } from "$/server/api/routers/user/email-otp/lib/email-code-key";

const verifyEmail = TRPCProcedures.protected
  .input(verifyEmailInput)
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.emailVerified !== null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El email ya está verificado");
    }

    if (
      ctx.session.user.email === null ||
      ctx.session.user.email === undefined
    ) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El email no existe");
    }

    const storedCode = await ctx.redis.get(
      `${emailCodeKey}:${ctx.session.user.email}`
    );
    if (storedCode === null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El código no existe. Solicita uno nuevo."
      );
    }
    if (storedCode !== input.otp) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El código es inválido");
    }

    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        emailVerified: DateTime.now().toUTC().toISO(),
      },
    });

    return true;
  });

export { verifyEmail };
