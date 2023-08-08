import { createTRPCRouter } from "$/server/api/trpc";
import { getPaymentsAsBorrower } from "$/server/api/routers/debts/payments/get-payments-as-borrower/handler";
import { addPaymentHandler } from "$/server/api/routers/debts/payments/add-payment/handler";
import { removePayment } from "$/server/api/routers/debts/payments/remove-payment/handler";

export const debtPaymentsSubRouter = createTRPCRouter({
  getPaymentsAsBorrower,
  addPayment: addPaymentHandler,
  removePayment,
});
