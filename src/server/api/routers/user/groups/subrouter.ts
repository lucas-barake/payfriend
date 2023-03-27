import { createTRPCRouter } from "$/server/api/trpc";
import {
  getOwnedGroups,
  getSharedGroups,
} from "$/server/api/routers/user/groups/getOwnedOrSharedGroups/handler";

const groupsSubRouter = createTRPCRouter({
  getOwnedGroups,
  getSharedGroups,
});

export default groupsSubRouter;
