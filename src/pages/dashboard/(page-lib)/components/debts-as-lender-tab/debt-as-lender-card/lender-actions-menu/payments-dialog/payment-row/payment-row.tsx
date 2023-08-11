import React from "react";
import { type GetPaymentsAsLenderResult } from "$/server/api/routers/debts/payments/get-payments-as-lender/types";
import { Card } from "$/components/ui/card";
import { formatCurrency } from "$/lib/utils/format-currency";
import { DateTime } from "luxon";
import { Badge } from "$/components/ui/badge";
import { Button } from "$/components/ui/button";
import { paymentStatusMap } from "$/pages/dashboard/(page-lib)/lib/payment-status-map";
import { Popover } from "$/components/ui/popover";
import { Separator } from "$/components/ui/separator";
import { PaymentStatus } from "@prisma/client";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/get-debts/debts-as-lender/input";
import { paymentStatusVariantsMap } from "$/pages/dashboard/(page-lib)/lib/payment-status-variants-map";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/get-debts/debts-as-lender/types";

type Props = {
  payment: GetPaymentsAsLenderResult["payments"][number];
  debt: DebtsAsLenderResult["debts"][number];
  queryVariables: DebtsAsLenderInput;
};

const PaymentRow: React.FC<Props> = ({ payment, debt, queryVariables }) => {
  const confirmPaymentMutation = api.debts.confirmPayment.useMutation();
  const apiContext = api.useContext();
  const isArchived = debt.archived !== null;

  async function handleConfirmPayment(): Promise<void> {
    await toast.promise(
      confirmPaymentMutation.mutateAsync({
        debtId: debt.id,
        paymentId: payment.id,
        borrowerId: payment.borrower.user.id,
      }),
      {
        loading: "Confirmando pago...",
        success: "Pago confirmado",
        error: handleMutationError,
      }
    );

    void apiContext.debts.getOwnedDebts.invalidate(queryVariables);

    apiContext.debts.getPaymentsAsLender.setData(
      { debtId: debt.id },
      (cache) => {
        if (cache === undefined) return cache;
        return {
          payments: cache.payments.map((cachedPayment) => {
            if (cachedPayment.id !== payment.id) return cachedPayment;
            return {
              ...cachedPayment,
              status: PaymentStatus.PAID,
            };
          }),
        } satisfies GetPaymentsAsLenderResult;
      }
    );
  }

  return (
    <Card className="mt-2 flex flex-col px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {payment.borrower.user.name}

          <span className="text-sm text-muted-foreground">
            {payment.borrower.user.email}
          </span>
        </div>

        <div className="flex flex-col text-success-text xs:flex-row xs:items-center xs:gap-1.5">
          {formatCurrency(payment.amount, payment.debt.currency)}{" "}
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

      {payment.status === PaymentStatus.PENDING_CONFIRMATION && (
        <Popover>
          <Popover.Trigger asChild>
            <Button
              className="mt-4 text-sm sm:mt-0"
              size="sm"
              disabled={isArchived}
            >
              Confirmar Pago
            </Button>
          </Popover.Trigger>

          <Popover.Content className="flex flex-col justify-center">
            <p className="mb-2 text-center text-sm">
              ¿Estás seguro que quieres confirmar este pago? Esta acción no se
              puede deshacer.
            </p>

            <Separator />

            <Button
              variant="destructive"
              className="mt-2 self-center text-sm"
              size="sm"
              loading={confirmPaymentMutation.isLoading}
              onClick={() => {
                void handleConfirmPayment();
              }}
            >
              Confirmar Pago
            </Button>
          </Popover.Content>
        </Popover>
      )}
    </Card>
  );
};

export default PaymentRow;
