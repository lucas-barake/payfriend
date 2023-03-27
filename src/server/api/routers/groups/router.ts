import { mergeTRPCRouters } from "$/server/api/trpc";
import debtsSubRouter from "$/server/api/routers/groups/debts/subrouter";
import groupsSubRouter from "$/server/api/routers/groups/groups/subrouter";
import usersSubRouter from "$/server/api/routers/groups/users/subrouter";

const groupsRouter = mergeTRPCRouters(
  groupsSubRouter,
  debtsSubRouter,
  usersSubRouter
);

export default groupsRouter;
