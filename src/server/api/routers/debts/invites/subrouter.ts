import { createTRPCRouter } from "$/server/api/trpc";
import { sendDebtInvite } from "$/server/api/routers/debts/invites/send-debt-invite/handler";
import { removeDebtInvite } from "$/server/api/routers/debts/invites/remove-debt-invite/handler";

export const invitesSubRouter = createTRPCRouter({
  sendDebtInvite,
  removeDebtInvite,
});
