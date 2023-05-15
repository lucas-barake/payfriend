import { mergeTRPCRouters } from "$/server/api/trpc";
import { groupDebtsMutations } from "$/server/api/routers/groups/debts/mutations";

const debtsSubRouter = mergeTRPCRouters(groupDebtsMutations);

export default debtsSubRouter;
