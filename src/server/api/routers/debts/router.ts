import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtsQueries } from "$/server/api/routers/debts/queries/subrouter";
import { debtPaymentsSubRouter } from "$/server/api/routers/debt-payments/router";
import { invitesSubRouter } from "$/server/api/routers/debt-invites/router";
import { generalDebtsSubRouter } from "$/server/api/routers/debts/mutations/general-subrouter";

export const debtsSubRouter = mergeTRPCRouters(
  debtsQueries,
  debtPaymentsSubRouter,
  generalDebtsSubRouter,
  invitesSubRouter
);
