import { mergeTRPCRouters } from "$/server/api/trpc";
import { groupUsersMutations } from "$/server/api/routers/groups/users/mutations";

export const usersSubRouter = mergeTRPCRouters(groupUsersMutations);
