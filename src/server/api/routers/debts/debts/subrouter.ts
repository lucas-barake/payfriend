import { mergeTRPCRouters } from "$/server/api/trpc";
import { groupMutations } from "$/server/api/routers/debts/debts/mutations";
import { groupQueries } from "$/server/api/routers/debts/debts/queries";

export const groupsSubRouter = mergeTRPCRouters(groupMutations, groupQueries);
