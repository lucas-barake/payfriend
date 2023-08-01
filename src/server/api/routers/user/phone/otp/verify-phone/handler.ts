import { TRPCProcedures } from "$/server/api/trpc";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { PHONE_CODE_KEY } from "$/server/api/routers/user/phone/otp/(lib)/phone-code-key";
import { DateTime } from "luxon";
import { verifyPhoneInput } from "$/server/api/routers/user/phone/otp/verify-phone/input";

export const verifyPhone = TRPCProcedures.protectedCritical
  .input(verifyPhoneInput)
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.phoneVerified !== null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El celular ya está verificado.");
    }

    const storedCode = await ctx.redis.get(
      `${PHONE_CODE_KEY}:${input.phone.phoneNumber}`
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
