import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtsMutations } from "$/server/api/routers/debts/debts/mutations";
import { debtsRouter } from "$/server/api/routers/debts/debts/queries";

export const debtsSubRouter = mergeTRPCRouters(debtsMutations, debtsRouter);
