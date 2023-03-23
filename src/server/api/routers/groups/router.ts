import { createTRPCRouter } from "$/server/api/trpc";
import getAllOwnedHandler from "$/server/api/routers/groups/queries/getAllOwned/handler";
import createHandler from "$/server/api/routers/groups/mutations/create/handler";
import getByIdHandler from "$/server/api/routers/groups/queries/getById/handler";
import getAllMembersHandler from "$/server/api/routers/groups/queries/getAllMembers/handler";
import getAllSharedHandler from "$/server/api/routers/groups/queries/getAllShared/handler";

export const groupsRouter = createTRPCRouter({
  getAll: getAllOwnedHandler,
  getAllShared: getAllSharedHandler,
  create: createHandler,
  getById: getByIdHandler,
  getAllMembers: getAllMembersHandler,
});
