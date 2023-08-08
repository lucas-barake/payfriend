import { createTRPCRouter } from "$/server/api/trpc";
import { createDebt } from "$/server/api/routers/debts/create-debt/handler";
import { archiveDebt } from "$/server/api/routers/debts/archive/handler";
import { confirmPayment } from "$/server/api/routers/debts/payments/confirm-payment/handler";
import { sendDebtInvite } from "$/server/api/routers/debts/invites/send-debt-invite/handler";
import { removeDebtInvite } from "$/server/api/routers/debts/invites/remove-debt-invite/handler";

export const debtsMutations = createTRPCRouter({
  createDebt,
  archiveDebt,
  confirmPendingConfirmation: confirmPayment,
  sendDebtInvite,
  removeDebtInvite,
});
