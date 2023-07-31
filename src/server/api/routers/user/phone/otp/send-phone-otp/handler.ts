import { sendPhoneOtpInput } from "$/server/api/routers/user/phone/otp/send-phone-otp/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { PHONE_CODE_KEY } from "$/server/api/routers/user/phone/otp/(lib)/phone-code-key";
import { TimeInSeconds } from "$/lib/enums/time";
import { APP_NAME } from "$/lib/constants/app-name";
import { env } from "$/env.mjs";
import { logger } from "$/server/logger";
import { TRPCProcedures } from "$/server/api/trpc";

export const sendPhoneOtp = TRPCProcedures.protected
  .input(sendPhoneOtpInput)
  .mutation(async ({ ctx, input }) => {
    if (ctx.session.user.phoneVerified !== null) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El celular ya está verificado");
    }

    const exists = await ctx.redis.exists(
      `${PHONE_CODE_KEY}:${input.phone.phoneNumber}`
    );
    if (exists) {
      throw CUSTOM_EXCEPTIONS.TOO_MANY_REQUESTS(
        "Ya solicitaste un código de verificación. Por favor espera unos minutos y vuelve a intentarlo."
      );
    }

    const fourDigitGeneratedOTP = String(
      Math.floor(1000 + Math.random() * 9000)
    );

    let transactionError: unknown = null;
    await ctx.redis
      .multi()
      .set(
        `${PHONE_CODE_KEY}:${input.phone.phoneNumber}`,
        fourDigitGeneratedOTP,
        "EX",
        TimeInSeconds.FiveMinutes
      )
      .exec()
      .then((results) => {
        if (results && results[0] && results[0][0] === null) {
          // Code saved successfully, proceed with sending the message
          return ctx.twilio.messages.create({
            body: `Your ${APP_NAME} code is ${fourDigitGeneratedOTP}`,
            from: env.TWILIO_FROM_WHATSAPP_NUMBER,
            to:
              env.TWILIO_DEV_TO_WHATSAPP_NUMBER ??
              `whatsapp:${input.phone.phoneNumber}`,
          });
        } else {
          // Redis transaction failed, throw an error
          throw new Error("Error al guardar el código de verificación");
        }
      })
      .then((message) => {
        logger.dev(
          `Se mandó el código de verificación ${fourDigitGeneratedOTP} a ${input.phone.phoneNumber} con el sid ${message.sid}`
        );
      })
      .catch((error: unknown) => {
        transactionError = error;
        logger.error(error);
        throw CUSTOM_EXCEPTIONS.INTERNAL_SERVER_ERROR(
          "Error al enviar el código de verificación"
        );
      })
      .finally(() => {
        // Perform rollback if Twilio message sending failed
        if (transactionError) {
          void ctx.redis.del(`${PHONE_CODE_KEY}:${input.phone.phoneNumber}`);
        }
      });

    if (transactionError) {
      logger.error(transactionError);
      throw CUSTOM_EXCEPTIONS.INTERNAL_SERVER_ERROR(
        "Error al enviar el código de verificación"
      );
    }

    return true;
  });
