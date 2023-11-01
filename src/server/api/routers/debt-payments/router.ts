import { createTRPCRouter } from "$/server/api/trpc";
import { getPaymentsAsBorrower } from "$/server/api/routers/debt-payments/get-payments-as-borrower/handler";
import { addPaymentHandler } from "$/server/api/routers/debt-payments/add-payment/handler";
import { removePayment } from "$/server/api/routers/debt-payments/remove-payment/handler";
import { confirmPayment } from "$/server/api/routers/debt-payments/confirm-payment/handler";
import { getPaymentsAsLender } from "$/server/api/routers/debt-payments/get-payments-as-lender/handler";

export const debtPaymentsSubRouter = createTRPCRouter({
  getPaymentsAsBorrower,
  addPayment: addPaymentHandler,
  removePayment,
  confirmPayment,
  getPaymentsAsLender,
});
