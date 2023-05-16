import { mergeTRPCRouters } from "$/server/api/trpc";
import { userGroupsQueries } from "$/server/api/routers/user/debts/queries";

export const userGroupsSubRouter = mergeTRPCRouters(userGroupsQueries);
