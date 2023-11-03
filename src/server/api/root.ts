import { createTRPCRouter } from "$/server/api/trpc";
import userRouter from "$/server/api/routers/user/router";
import { debtsSubRouter } from "$/server/api/routers/debts/router";
import { subscriptionPlansRouter } from "$/server/api/routers/subscription-plans/router";
import { personalExpensesRouter } from "$/server/api/routers/personal-expenses/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  debts: debtsSubRouter,
  user: userRouter,
  subscriptions: subscriptionPlansRouter,
  personalExpenses: personalExpensesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
