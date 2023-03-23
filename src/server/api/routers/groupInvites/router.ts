import { createTRPCRouter } from "$/server/api/trpc";
import sendInviteHandler from "$/server/api/routers/groupInvites/mutations/sendInvite/handler";
import getAllHandler from "$/server/api/routers/groupInvites/queries/get-all/handler";
import cancelInviteHandler from "$/server/api/routers/groupInvites/mutations/cancelInvite/handler";
import acceptInviteHandler from "$/server/api/routers/groupInvites/mutations/acceptInvite/handler";

export const invitesRouter = createTRPCRouter({
  getAll: getAllHandler,
  sendInvite: sendInviteHandler,
  rejectInvite: cancelInviteHandler,
  acceptInvite: acceptInviteHandler,
});
