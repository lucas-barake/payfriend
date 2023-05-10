import { createTRPCRouter } from "$/server/api/trpc";
import { sendEmailOTP } from "$/server/api/routers/user/email-otp/send-otp/handler";
import { verifyEmail } from "$/server/api/routers/user/email-otp/verify/handler";

const emailOTPSubRouter = createTRPCRouter({
  sendEmailOTP,
  verifyEmailOTP: verifyEmail,
});

export { emailOTPSubRouter };
