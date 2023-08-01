import { createTRPCRouter } from "$/server/api/trpc";
import { verifyPhone } from "$/server/api/routers/user/phone/otp/verify-phone/handler";
import { sendPhoneOtp } from "$/server/api/routers/user/phone/otp/send-phone-otp/handler";
import { getPhoneOtpTtl } from "$/server/api/routers/user/phone/otp/get-phone-otp-ttl/handler";

export const phoneSubRouter = createTRPCRouter({
  verifyPhone,
  sendPhoneOtp,
  getPhoneOtpTtl,
});
