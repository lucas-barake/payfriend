import { createTRPCRouter } from "$/server/api/trpc";
import { getPaymentsAsBorrower } from "$/server/api/routers/debts/payments/get-payments-as-borrower/handler";
import { addPaymentHandler } from "$/server/api/routers/debts/payments/add-payment/handler";
import { removePayment } from "$/server/api/routers/debts/payments/remove-payment/handler";
import { confirmPayment } from "$/server/api/routers/debts/payments/confirm-payment/handler";
import { getPaymentsAsLender } from "$/server/api/routers/debts/payments/get-payments-as-lender/handler";

export const debtPaymentsSubRouter = createTRPCRouter({
  getPaymentsAsBorrower,
  addPayment: addPaymentHandler,
  removePayment,
  confirmPayment,
  getPaymentsAsLender,
});
