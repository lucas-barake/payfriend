import { TRPCProcedures } from "$/server/api/trpc";
import { sendPhoneOtpInput } from "$/server/api/routers/user/phone/otp/send-phone-otp/input";
import { PHONE_CODE_KEY } from "$/server/api/routers/user/phone/otp/(lib)/phone-code-key";

export const getPhoneOtpTtl = TRPCProcedures.protected
  .input(sendPhoneOtpInput)
  .query(async ({ ctx, input }) => {
    const ttl = await ctx.redis.ttl(
      `${PHONE_CODE_KEY}:${input.phone.phoneNumber}`
    );
    return {
      ttlInSeconds: ttl,
    };
  });
