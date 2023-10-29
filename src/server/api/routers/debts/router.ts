import { createTRPCRouter, mergeTRPCRouters } from "$/server/api/trpc";
import { debtsQueries } from "$/server/api/routers/debts/get-debts/subrouter";
import { debtPaymentsSubRouter } from "$/server/api/routers/debts/payments/subrouter";
import { createDebt } from "$/server/api/routers/debts/create-debt/handler";
import { archiveDebt } from "$/server/api/routers/debts/archive/handler";
import { invitesSubRouter } from "$/server/api/routers/debts/invites/subrouter";
import { getUniquePartners } from "$/server/api/routers/debts/get-unique-partners/handler";

const generalDebtsSubRouter = createTRPCRouter({
  createDebt,
  archiveDebt,
  getUniquePartners,
});

export const debtsSubRouter = mergeTRPCRouters(
  debtsQueries,
  debtPaymentsSubRouter,
  generalDebtsSubRouter,
  invitesSubRouter
);
