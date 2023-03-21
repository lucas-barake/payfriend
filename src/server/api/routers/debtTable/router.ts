import { createTRPCRouter } from "$/server/api/trpc";
import getAllHandler from "$/server/api/routers/debtTable/queries/getAll/handler";
import createHandler from "$/server/api/routers/debtTable/mutations/create/handler";
import getByIdHandler from "$/server/api/routers/debtTable/mutations/getById/handler";
import getAllCollaboratorsHandler from "$/server/api/routers/debtTable/queries/getAllCollaborators/handler";

export const debtTableRouter = createTRPCRouter({
  getAll: getAllHandler,
  create: createHandler,
  getById: getByIdHandler,
  getAllCollaborators: getAllCollaboratorsHandler,
});
