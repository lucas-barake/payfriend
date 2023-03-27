import { mergeTRPCRouters } from "$/server/api/trpc";
import OTPSubRouter from "$/server/api/routers/user/otp/subrouter";
import groupInvitesSubRouter from "$/server/api/routers/user/groupInvites/subrouter";
import groupsSubRouter from "$/server/api/routers/user/groups/subrouter";

const userRouter = mergeTRPCRouters(
  OTPSubRouter,
  groupInvitesSubRouter,
  groupsSubRouter
);

export default userRouter;
