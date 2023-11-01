import { createTRPCRouter } from "$/server/api/trpc";
import { sendDebtInvite } from "$/server/api/routers/debt-invites/send-debt-invite/handler";
import { removeDebtInvite } from "$/server/api/routers/debt-invites/remove-debt-invite/handler";

export const invitesSubRouter = createTRPCRouter({
  sendDebtInvite,
  removeDebtInvite,
});
