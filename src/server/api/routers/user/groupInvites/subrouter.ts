import { createTRPCRouter } from "$/server/api/trpc";
import getGroupInvites from "$/server/api/routers/user/groupInvites/getGroupInvites/handler";
import acceptGroupInvite from "$/server/api/routers/user/groupInvites/acceptGroupInvite/handler";
import sendGroupInvite from "$/server/api/routers/user/groupInvites/sendGroupInvite/handler";
import declineGroupInvite from "$/server/api/routers/user/groupInvites/declineGroupInvite/handler";

const groupInvitesSubRouter = createTRPCRouter({
  acceptGroupInvite,
  getGroupInvites,
  declineGroupInvite,
  sendGroupInvite,
});

export default groupInvitesSubRouter;
