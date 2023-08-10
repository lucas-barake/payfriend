import React from "react";
import { type GetPaymentsAsBorrowerResult } from "$/server/api/routers/debts/payments/get-payments-as-borrower/types";
import { api } from "$/lib/utils/api";
import { formatCurrency } from "$/lib/utils/format-currency";
import { DateTime } from "luxon";
import { Badge } from "$/components/ui/badge";
import { Button } from "$/components/ui/button";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { Trash } from "lucide-react";
import { Card } from "$/components/ui/card";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/get-debts/debts-as-borrower/input";
import { type DebtsAsBorrowerResult } from "$/server/api/routers/debts/get-debts/debts-as-borrower/types";
import { useSession } from "next-auth/react";
import { paymentStatusMap } from "$/pages/dashboard/(page-lib)/lib/payment-status-map";
import { paymentStatusVariantsMap } from "$/pages/dashboard/(page-lib)/lib/payment-status-variants-map";

type Props = {
  payment: GetPaymentsAsBorrowerResult[number];
  debtId: string;
  queryVariables: DebtsAsBorrowerInput;
};

const PaymentRow: React.FC<Props> = ({ payment, debtId, queryVariables }) => {
  const apiContext = api.useContext();
  const removePaymentMutation = api.debts.removePayment.useMutation();
  const session = useSession();

  async function handleRemove(): Promise<void> {
    await toast.promise(
      removePaymentMutation.mutateAsync({
        paymentId: payment.id,
        debtId,
      }),
      {
        loading: "Eliminando pago...",
        success: "Pago eliminado",
        error: handleMutationError,
      }
    );

    apiContext.debts.getPaymentsAsBorrower.setData(
      {
        debtId,
      },
      (cache) => {
        return cache?.filter(({ id }) => id !== payment.id) satisfies
          | GetPaymentsAsBorrowerResult
          | undefined;
      }
    );

    apiContext.debts.getSharedDebts.setData(queryVariables, (cache) => {
      if (cache === undefined) return cache;
      return {
        debts: cache.debts.map((debt) => {
          if (debt.id !== debtId) return debt;
          return {
            ...debt,
            borrowers: debt.borrowers.map((borrower) => {
              if (borrower.user.id !== session.data?.user.id) return borrower;
              return {
                ...borrower,
                balance: borrower.balance + payment.amount,
                payments: borrower.payments.filter(
                  ({ id }) => id !== payment.id
                ),
              };
            }),
          };
        }),
        count: cache.count,
      } satisfies DebtsAsBorrowerResult;
    });
  }

  return (
    <Card className="mt-2 flex items-center justify-between px-4 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col text-success-text xs:flex-row xs:items-center xs:gap-1.5">
          {formatCurrency(payment.amount)}{" "}
          <span className="text-sm text-muted-foreground">
            {DateTime.fromJSDate(payment.createdAt).toLocaleString(
              DateTime.DATE_MED
            )}
          </span>
        </div>

        <Badge
          variant={paymentStatusVariantsMap.get(payment.status)}
          className="self-start"
        >
          {paymentStatusMap.get(payment.status)}
        </Badge>
      </div>

      <Button
        size="icon"
        variant="destructive"
        disabled={payment.status === "PAID" || payment.status === "MISSED"}
        onClick={() => {
          void handleRemove();
        }}
        loading={removePaymentMutation.isLoading}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Eliminar Pago</span>
      </Button>
    </Card>
  );
};

export default PaymentRow;
