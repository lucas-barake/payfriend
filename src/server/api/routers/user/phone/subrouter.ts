import { createTRPCRouter } from "$/server/api/trpc";
import { sendPhoneCode } from "$/server/api/routers/user/phone/send-code/handler";
import { verifyPhone } from "$/server/api/routers/user/phone/verify/handler";

const phoneSubRouter = createTRPCRouter({
  sendPhoneCode,
  verifyPhone,
});

export default phoneSubRouter;
