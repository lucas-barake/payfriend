import { createTRPCRouter } from "$/server/api/trpc";
import getGroupInvites from "$/server/api/routers/user/group-invites/get-group-invites/handler";
import acceptGroupInvite from "$/server/api/routers/user/group-invites/accept-group-invite/handler";
import sendGroupInvite from "$/server/api/routers/user/group-invites/send-group-invite/handler";
import declineGroupInvite from "$/server/api/routers/user/group-invites/decline-group-invite/handler";

const groupInvitesSubRouter = createTRPCRouter({
  acceptGroupInvite,
  getGroupInvites,
  declineGroupInvite,
  sendGroupInvite,
});

export default groupInvitesSubRouter;
