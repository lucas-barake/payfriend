import { mergeTRPCRouters } from "$/server/api/trpc";
import { userGroupInvitesMutations } from "$/server/api/routers/user/group-invites/mutations";
import { userGroupinvitesQueries } from "$/server/api/routers/user/group-invites/queries";

export const userGroupInvitesSubRouter = mergeTRPCRouters(
  userGroupInvitesMutations,
  userGroupinvitesQueries
);
