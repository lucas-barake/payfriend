import { mergeTRPCRouters } from "$/server/api/trpc";
import { paymentLinkSubRouter } from "$/server/api/routers/transactions/payment-link/subrouter";

export const transactionsRouter = mergeTRPCRouters(paymentLinkSubRouter);
