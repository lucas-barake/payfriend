import { mergeTRPCRouters } from "$/server/api/trpc";
import { userGroupInvitesMutations } from "$/server/api/routers/user/debt-invites/mutations";
import { debtInvitesQueriesRouter } from "$/server/api/routers/user/debt-invites/queries";

export const debtInvitesRouter = mergeTRPCRouters(
  userGroupInvitesMutations,
  debtInvitesQueriesRouter
);
