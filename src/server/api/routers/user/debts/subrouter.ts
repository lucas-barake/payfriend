import { mergeTRPCRouters } from "$/server/api/trpc";
import { userGroupsQueries } from "$/server/api/routers/user/debts/queries/handler";

export const userGroupsSubRouter = mergeTRPCRouters(userGroupsQueries);
