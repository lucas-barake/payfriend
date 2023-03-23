import { createTRPCRouter } from "$/server/api/trpc";
import { groupsRouter } from "$/server/api/routers/groups/router";
import { invitesRouter } from "$/server/api/routers/groupInvites/router";
import collaboratorsRouter from "$/server/api/routers/collaborators/router";
import emailVerificationRouter from "$/server/api/routers/emailVerification/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  groupInvites: invitesRouter,
  collaborators: collaboratorsRouter,
  emailVerification: emailVerificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
