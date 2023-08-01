import { createTRPCRouter } from "$/server/api/trpc";
import userRouter from "$/server/api/routers/user/router";
import { debtsSubRouter } from "$/server/api/routers/debts/subrouter";
import { subscriptionPlansRouter } from "$/server/api/routers/subscription-plans/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  debts: debtsSubRouter,
  user: userRouter,
  subscriptions: subscriptionPlansRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
