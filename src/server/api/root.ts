import { createTRPCRouter } from "$/server/api/trpc";
import groupsRouter from "$/server/api/routers/debts/router";
import userRouter from "$/server/api/routers/user/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
