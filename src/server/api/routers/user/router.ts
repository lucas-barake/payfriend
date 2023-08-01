import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtInvitesRouter } from "$/server/api/routers/user/debt-invites/subrouter";
import { phoneSubRouter } from "$/server/api/routers/user/phone/subrouter";
import { userFreePlanSubRouter } from "$/server/api/routers/user/free-plan/subrouter";

const userRouter = mergeTRPCRouters(
  phoneSubRouter,
  debtInvitesRouter,
  userFreePlanSubRouter
);

export default userRouter;
