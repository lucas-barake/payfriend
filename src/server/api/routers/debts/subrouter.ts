import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtsMutations } from "$/server/api/routers/debts/mutations/handler";
import { debtsQueries } from "$/server/api/routers/debts/queries/handler";

export const debtsSubRouter = mergeTRPCRouters(debtsMutations, debtsQueries);
