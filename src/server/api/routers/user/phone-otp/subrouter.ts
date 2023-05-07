import { createTRPCRouter } from "$/server/api/trpc";
import sendPhoneOTP from "$/server/api/routers/user/phone-otp/send-otp/handler";
import verifyPhoneOTP from "$/server/api/routers/user/phone-otp/verify-otp/handler";

const OTPSubRouter = createTRPCRouter({
  sendPhoneOTP,
  verifyPhoneOTP,
});

export default OTPSubRouter;
