import { protectedProcedure } from "$/server/api/trpc";
import { env } from "$/env.mjs";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { sendPhoneCodeInput } from "$/server/api/routers/user/phone/send-code/input";
import { phoneCodeKey } from "$/server/api/routers/user/phone/lib/phone-code-key";

const sendPhoneCode = protectedProcedure
  .input(sendPhoneCodeInput)
  .mutation(async ({ ctx, input }) => {
    const isInDev = env.NODE_ENV === "development";

    if (ctx.session.user.phoneVerified !== null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El celular ya está verificado");
    }

    const exists = await ctx.redis.exists(
      `${phoneCodeKey}:${input.phone.phoneNumber}`
    );
    if (exists) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "Ya solicitaste un código de verificación. Por favor espera unos minutos y vuelve a intentarlo."
      );
    }

    const fourDigitGeneratedOTP = String(
      Math.floor(1000 + Math.random() * 9000)
    );

    if (isInDev) {
      console.log(
        `✅ Se envió el código de verificación ${fourDigitGeneratedOTP} a ${input.phone.phoneNumber}`
      );
    }

    await ctx.redis.set(
      `${phoneCodeKey}:${input.phone.phoneNumber}`,
      fourDigitGeneratedOTP,
      "EX",
      120
    );

    return true;
  });

export { sendPhoneCode };
