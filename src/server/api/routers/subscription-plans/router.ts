import { mergeTRPCRouters } from "$/server/api/trpc";
import { subscriptionsMutations } from "$/server/api/routers/subscription-plans/mutations/handler";

export const subscriptionPlansRouter = mergeTRPCRouters(subscriptionsMutations);
