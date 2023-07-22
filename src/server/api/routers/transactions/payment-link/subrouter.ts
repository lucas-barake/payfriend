import { mergeTRPCRouters } from "$/server/api/trpc";
import { transactionsMutations } from "$/server/api/routers/transactions/payment-link/mutations/handler";

export const paymentLinkSubRouter = mergeTRPCRouters(transactionsMutations);
