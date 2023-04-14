import { createTRPCRouter } from "$/server/api/trpc";
import sendOTP from "$/server/api/routers/user/otp/send-otp/handler";
import verifyOTP from "$/server/api/routers/user/otp/verify-otp/handler";

const OTPSubRouter = createTRPCRouter({
  sendOTP,
  verifyOTP,
});

export default OTPSubRouter;
