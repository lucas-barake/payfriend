import { createTRPCRouter } from "$/server/api/trpc";
import changeRoleHandler from "$/server/api/routers/collaborators/mutations/changeRole/handler";

const collaboratorsRouter = createTRPCRouter({
  changeRole: changeRoleHandler,
});

export default collaboratorsRouter;
