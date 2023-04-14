import { createTRPCRouter } from "$/server/api/trpc";
import updateUserRole from "$/server/api/routers/groups/users/update-user-role/handler";
import removeUser from "$/server/api/routers/groups/users/remove-user/handler";

const usersSubRouter = createTRPCRouter({
  removeUser,
  updateUserRole,
});

export default usersSubRouter;
