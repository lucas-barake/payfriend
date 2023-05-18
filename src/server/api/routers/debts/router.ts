import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtsSubRouter } from "$/server/api/routers/debts/debts/subrouter";
import { usersSubRouter } from "$/server/api/routers/debts/users/subrouter";

const debtsRouter = mergeTRPCRouters(debtsSubRouter, usersSubRouter);

export default debtsRouter;
