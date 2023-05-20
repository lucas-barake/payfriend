import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtInvitesRouter } from "$/server/api/routers/user/debt-invites/subrouter";
import { userGroupsSubRouter } from "$/server/api/routers/user/debts/subrouter";
import { phoneSubRouter } from "$/server/api/routers/user/phone/subrouter";

const userRouter = mergeTRPCRouters(
  phoneSubRouter,
  debtInvitesRouter,
  userGroupsSubRouter
);

export default userRouter;
