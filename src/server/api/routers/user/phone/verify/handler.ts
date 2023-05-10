import { protectedProcedure } from "$/server/api/trpc";
import { DateTime } from "luxon";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { phoneCodeKey } from "$/server/api/routers/user/phone/lib/phone-code-key";
import { verifyPhoneInput } from "$/server/api/routers/user/phone/verify/input";

const verifyPhone = protectedProcedure
  .input(verifyPhoneInput)
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.phoneVerified !== null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El email ya está verificado");
    }

    const storedCode = await ctx.redis.get(
      `${phoneCodeKey}:${input.phone.phoneNumber}`
    );
    if (storedCode === null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El código no existe. Solicita uno nuevo."
      );
    }
    if (storedCode !== input.otp) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El código es inválido.");
    }

    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        phoneNumber: input.phone.phoneNumber,
        phoneVerified: DateTime.now().toUTC().toISO(),
      },
    });

    return true;
  });

export { verifyPhone };
