import { mergeTRPCRouters } from "$/server/api/trpc";
import { userGroupsQueries } from "$/server/api/routers/user/groups/queries";

export const userGroupsSubRouter = mergeTRPCRouters(userGroupsQueries);
