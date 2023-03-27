import { createTRPCRouter } from "$/server/api/trpc";
import updateUserRole from "$/server/api/routers/groups/users/updateUserRole/handler";
import removeUser from "$/server/api/routers/groups/users/removeUser/handler";

const usersSubRouter = createTRPCRouter({
  removeUser,
  updateUserRole,
});

export default usersSubRouter;
