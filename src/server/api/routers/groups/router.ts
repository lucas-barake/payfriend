import { createTRPCRouter } from "$/server/api/trpc";
import getAllOwnedHandler from "$/server/api/routers/groups/queries/getAllOwned/handler";
import createHandler from "$/server/api/routers/groups/mutations/createAndUpdate/create/handler";
import getByIdHandler from "$/server/api/routers/groups/queries/getById/handler";
import getSettingsHandler from "$/server/api/routers/groups/queries/getSettingsHandler/handler";
import getAllSharedHandler from "$/server/api/routers/groups/queries/getAllShared/handler";
import updateHandler from "$/server/api/routers/groups/mutations/createAndUpdate/update/handler";
import deleteHandler from "$/server/api/routers/groups/mutations/delete/handler";

export const groupsRouter = createTRPCRouter({
  create: createHandler,
  update: updateHandler,
  delete: deleteHandler,
  getAll: getAllOwnedHandler,
  getAllShared: getAllSharedHandler,
  getById: getByIdHandler,
  getSettings: getSettingsHandler,
});