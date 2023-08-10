import { createTRPCRouter, mergeTRPCRouters } from "$/server/api/trpc";
import { debtsQueries } from "$/server/api/routers/debts/get-debts/subrouter";
import { debtPaymentsSubRouter } from "$/server/api/routers/debts/payments/subrouter";
import { createDebt } from "$/server/api/routers/debts/create-debt/handler";
import { archiveDebt } from "$/server/api/routers/debts/archive/handler";
import { invitesSubRouter } from "$/server/api/routers/debts/invites/subrouter";

const generalDebtsSubRouter = createTRPCRouter({
  createDebt,
  archiveDebt,
});

export const debtsSubRouter = mergeTRPCRouters(
  debtsQueries,
  debtPaymentsSubRouter,
  generalDebtsSubRouter,
  invitesSubRouter
);
