import { mergeTRPCRouters } from "$/server/api/trpc";
import { userGroupInvitesMutations } from "$/server/api/routers/user/debt-invites/mutations/handler";
import { debtInvitesQueriesRouter } from "$/server/api/routers/user/debt-invites/queries/handler";

export const debtInvitesRouter = mergeTRPCRouters(
  userGroupInvitesMutations,
  debtInvitesQueriesRouter
);
