import { createTRPCRouter } from "$/server/api/trpc";
import { create } from "$/server/api/routers/debts/mutations/create/handler";
import { archiveDebt } from "$/server/api/routers/debts/mutations/archive/handler";
import { setPendingConfirmation } from "$/server/api/routers/debts/mutations/set-pending-confirmation/handler";
import { confirmPendingConfirmation } from "$/server/api/routers/debts/mutations/confirm-pending-confirmation/handler";
import { rejectPendingConfirmation } from "$/server/api/routers/debts/mutations/reject-pending-confirmation/handler";
import { sendDebtInvite } from "$/server/api/routers/debts/mutations/send-debt-invite/handler";
import { removeDebtInvite } from "$/server/api/routers/debts/mutations/remove-debt-invite/handler";

export const debtsMutations = createTRPCRouter({
  create,
  archiveDebt,
  setPendingConfirmation,
  confirmPendingConfirmation,
  rejectPendingConfirmation,
  sendDebtInvite,
  removeDebtInvite,
});
