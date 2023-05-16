import { mergeTRPCRouters } from "$/server/api/trpc";
import debtsSubRouter, {
  groupsSubRouter,
} from "$/server/api/routers/debts/debts/subrouter";
import { usersSubRouter } from "$/server/api/routers/debts/users/subrouter";

const groupsRouter = mergeTRPCRouters(
  groupsSubRouter,
  debtsSubRouter,
  usersSubRouter
);

export default groupsRouter;
