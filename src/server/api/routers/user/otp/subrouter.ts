import { createTRPCRouter } from "$/server/api/trpc";
import sendOTP from "$/server/api/routers/user/otp/sendOTP/handler";
import verifyOTP from "$/server/api/routers/user/otp/verifyOTP/handler";

const OTPSubRouter = createTRPCRouter({
  sendOTP,
  verifyOTP,
});

export default OTPSubRouter;
