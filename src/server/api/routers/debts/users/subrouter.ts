import { mergeTRPCRouters } from "$/server/api/trpc";
import { groupUsersMutations } from "$/server/api/routers/debts/users/mutations";

export const usersSubRouter = mergeTRPCRouters(groupUsersMutations);
