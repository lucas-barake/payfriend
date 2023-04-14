import { createTRPCRouter } from "$/server/api/trpc";
import createGroup from "$/server/api/routers/groups/groups/create-update/createGroup";
import updateGroup from "$/server/api/routers/groups/groups/create-update/updateGroup";
import deleteGroup from "$/server/api/routers/groups/groups/delete-group/handler";
import getSettingsById from "$/server/api/routers/groups/groups/get-settings-by-id/handler";
import getGroupById from "$/server/api/routers/groups/groups/get-group-by-id/handler";

const groupsSubRouter = createTRPCRouter({
  createGroup,
  updateGroup,
  deleteGroup,
  getSettingsById,
  getGroupById,
});

export default groupsSubRouter;
