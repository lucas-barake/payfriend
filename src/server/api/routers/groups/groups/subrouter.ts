import { createTRPCRouter } from "$/server/api/trpc";
import createGroup from "$/server/api/routers/groups/groups/create-update/createGroup";
import updateGroup from "$/server/api/routers/groups/groups/create-update/updateGroup";
import deleteGroup from "$/server/api/routers/groups/groups/deleteGroup/handler";
import getSettingsById from "$/server/api/routers/groups/groups/getSettingsById/handler";
import getGroupById from "$/server/api/routers/groups/groups/getGroupById/handler";

const groupsSubRouter = createTRPCRouter({
  createGroup,
  updateGroup,
  deleteGroup,
  getSettingsById,
  getGroupById,
});

export default groupsSubRouter;
