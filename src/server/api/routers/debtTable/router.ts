import { createTRPCRouter } from "$/server/api/trpc";
import getAllOwnedHandler from "$/server/api/routers/debtTable/queries/getAllOwned/handler";
import createHandler from "$/server/api/routers/debtTable/mutations/create/handler";
import getByIdHandler from "$/server/api/routers/debtTable/queries/getById/handler";
import getAllCollaboratorsHandler from "$/server/api/routers/debtTable/queries/getAllCollaborators/handler";
import getAllSharedHandler from "$/server/api/routers/debtTable/queries/getAllShared/handler";

export const debtTableRouter = createTRPCRouter({
  getAllOwned: getAllOwnedHandler,
  getAllShared: getAllSharedHandler,
  create: createHandler,
  getById: getByIdHandler,
  getAllCollaborators: getAllCollaboratorsHandler,
});
