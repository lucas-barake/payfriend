import { personalExpensesMutationsSubRouter } from "$/server/api/routers/personal-expenses/mutations/subrouter";
import { personalExpensesQueriesSubRouter } from "$/server/api/routers/personal-expenses/queries/subrouter";
import { mergeTRPCRouters } from "$/server/api/trpc";

export const personalExpensesRouter = mergeTRPCRouters(
  personalExpensesMutationsSubRouter,
  personalExpensesQueriesSubRouter
);
