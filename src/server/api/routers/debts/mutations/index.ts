import { createTRPCRouter } from "$/server/api/trpc";
import { createDebt } from "$/server/api/routers/debts/create-debt/handler";
import { archiveDebt } from "$/server/api/routers/debts/archive/handler";
import { setPendingConfirmation } from "$/server/api/routers/debts/mutations/handlers/confirmations/set-pending-confirmation/handler";
import { confirmPendingConfirmation } from "$/server/api/routers/debts/mutations/handlers/confirmations/confirm-pending-confirmation/handler";
import { rejectPendingConfirmation } from "$/server/api/routers/debts/mutations/handlers/confirmations/reject-pending-confirmation/handler";
import { sendDebtInvite } from "$/server/api/routers/debts/invites/send-debt-invite/handler";
import { removeDebtInvite } from "$/server/api/routers/debts/invites/remove-debt-invite/handler";

export const debtsMutations = createTRPCRouter({
  createDebt,
  archiveDebt,
  setPendingConfirmation,
  confirmPendingConfirmation,
  rejectPendingConfirmation,
  sendDebtInvite,
  removeDebtInvite,
});
