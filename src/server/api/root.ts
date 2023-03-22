import { createTRPCRouter } from "$/server/api/trpc";
import { debtTableRouter } from "$/server/api/routers/debtTable/router";
import { invitesRouter } from "$/server/api/routers/invites/router";
import collaboratorsRouter from "$/server/api/routers/collaborators/router";
import emailVerificationRouter from "$/server/api/routers/emailVerification/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  debtTables: debtTableRouter,
  invites: invitesRouter,
  collaborators: collaboratorsRouter,
  emailVerification: emailVerificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
