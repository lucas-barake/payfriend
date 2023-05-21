import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtsMutations } from "$/server/api/routers/debts/mutations/handler";

export const debtsSubRouter = mergeTRPCRouters(debtsMutations);
