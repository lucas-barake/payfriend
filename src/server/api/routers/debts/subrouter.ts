import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtsMutations } from "$/server/api/routers/debts/mutations";
import { debtsQueries } from "$/server/api/routers/debts/queries";

export const debtsSubRouter = mergeTRPCRouters(debtsMutations, debtsQueries);
