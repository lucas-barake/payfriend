import { mergeTRPCRouters } from "$/server/api/trpc";
import { phoneSubRouter } from "$/server/api/routers/user/phone/subrouter";
import groupInvitesSubRouter from "$/server/api/routers/user/group-invites/subrouter";
import groupsSubRouter from "$/server/api/routers/user/groups/subrouter";

const userRouter = mergeTRPCRouters(
  phoneSubRouter,
  groupInvitesSubRouter,
  groupsSubRouter
);

export default userRouter;
