import { mergeTRPCRouters } from "$/server/api/trpc";
import { groupMutations } from "$/server/api/routers/groups/groups/mutations";
import { groupQueries } from "$/server/api/routers/groups/groups/queries";

export const groupsSubRouter = mergeTRPCRouters(groupMutations, groupQueries);
