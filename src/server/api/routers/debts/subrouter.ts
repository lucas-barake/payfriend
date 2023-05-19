import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtsMutations } from "$/server/api/routers/debts/mutations";

export const debtsSubRouter = mergeTRPCRouters(debtsMutations);
