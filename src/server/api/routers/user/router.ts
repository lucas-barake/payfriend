import { mergeTRPCRouters } from "$/server/api/trpc";
import { userGroupInvitesSubRouter } from "$/server/api/routers/user/group-invites/subrouter";
import { userGroupsSubRouter } from "$/server/api/routers/user/debts/subrouter";
import { phoneSubRouter } from "$/server/api/routers/user/phone/subrouter";

const userRouter = mergeTRPCRouters(
  phoneSubRouter,
  userGroupInvitesSubRouter,
  userGroupsSubRouter
);

export default userRouter;
