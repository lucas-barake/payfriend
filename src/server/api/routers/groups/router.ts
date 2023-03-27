import { createTRPCRouter } from "$/server/api/trpc";
import create from "$/server/api/routers/groups/mutations/create-update/create/handler";
import getById from "$/server/api/routers/groups/queries/byId/handler";
import getSettingsById from "$/server/api/routers/groups/queries/getSettingsById/handler";
import update from "$/server/api/routers/groups/mutations/create-update/update/handler";
import deleteOne from "$/server/api/routers/groups/mutations/delete/handler";
import updateUserRole from "$/server/api/routers/groups/mutations/updateUserRole/handler";
import removeUser from "$/server/api/routers/groups/mutations/removeUser/handler";

export const groupsRouter = createTRPCRouter({
  create,
  update,
  deleteOne,
  updateUserRole,
  removeUser,
  getById,
  getSettingsById,
});
