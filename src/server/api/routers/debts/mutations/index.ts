import { createTRPCRouter } from "$/server/api/trpc";
import { create } from "$/server/api/routers/debts/mutations/handlers/create/handler";
import { archiveDebt } from "$/server/api/routers/debts/mutations/handlers/archive/handler";
import { setPendingConfirmation } from "$/server/api/routers/debts/mutations/handlers/confirmations/set-pending-confirmation/handler";
import { confirmPendingConfirmation } from "$/server/api/routers/debts/mutations/handlers/confirmations/confirm-pending-confirmation/handler";
import { rejectPendingConfirmation } from "$/server/api/routers/debts/mutations/handlers/confirmations/reject-pending-confirmation/handler";
import { sendDebtInvite } from "$/server/api/routers/debts/mutations/handlers/invites/send-debt-invite/handler";
import { removeDebtInvite } from "$/server/api/routers/debts/mutations/handlers/invites/remove-debt-invite/handler";

export const debtsMutations = createTRPCRouter({
  create,
  archiveDebt,
  setPendingConfirmation,
  confirmPendingConfirmation,
  rejectPendingConfirmation,
  sendDebtInvite,
  removeDebtInvite,
});
