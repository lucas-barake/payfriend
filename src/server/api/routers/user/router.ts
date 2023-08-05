import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtInvitesRouter } from "$/server/api/routers/user/debt-invites/subrouter";
import { phoneSubRouter } from "$/server/api/routers/user/phone/subrouter";
import { userFreePlanSubRouter } from "$/server/api/routers/user/free-plan/subrouter";
import { recentEmailsSubRouter } from "$/server/api/routers/user/recent-emails/subrouter";

const userRouter = mergeTRPCRouters(
  phoneSubRouter,
  debtInvitesRouter,
  userFreePlanSubRouter,
  recentEmailsSubRouter
);

export default userRouter;
