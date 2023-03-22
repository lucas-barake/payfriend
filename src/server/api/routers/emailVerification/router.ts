import { createTRPCRouter } from "$/server/api/trpc";
import sendOTPHandler from "$/server/api/routers/emailVerification/mutations/sendOTP/handler";
import verifyOTPHandler from "$/server/api/routers/emailVerification/mutations/verifyOTP/handler";

const emailVerificationRouter = createTRPCRouter({
  sendVerificationEmail: sendOTPHandler,
  verifyOTP: verifyOTPHandler,
});

export default emailVerificationRouter;
