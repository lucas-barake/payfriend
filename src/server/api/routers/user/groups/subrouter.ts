import { createTRPCRouter } from "$/server/api/trpc";
import {
  getOwnedGroups,
  getSharedGroups,
} from "$/server/api/routers/user/groups/get-owned-or-shared-groups/handler";

const groupsSubRouter = createTRPCRouter({
  getOwnedGroups,
  getSharedGroups,
});

export default groupsSubRouter;
