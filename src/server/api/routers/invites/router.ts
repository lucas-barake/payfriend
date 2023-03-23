import { createTRPCRouter } from "$/server/api/trpc";
import sendInviteHandler from "$/server/api/routers/invites/mutations/sendInvite/handler";
import getAllHandler from "$/server/api/routers/invites/queries/get-all/handler";
import cancelInviteHandler from "$/server/api/routers/invites/mutations/cancelInvite/handler";
import acceptInviteHandler from "$/server/api/routers/invites/mutations/acceptInvite/handler";

export const invitesRouter = createTRPCRouter({
  getAllOwned: getAllHandler,
  sendInvite: sendInviteHandler,
  rejectInvite: cancelInviteHandler,
  acceptInvite: acceptInviteHandler,
});
