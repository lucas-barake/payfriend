import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/queries/handlers/debts-as-lender/input";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Loader } from "$/components/ui/loader";
import { ScrollArea } from "$/components/ui/scroll-area";
import PaymentRow from "$/pages/dashboard/(page-lib)/components/debt-card/lender-actions-menu/payments-dialog/payment-row";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtId: string;
  queryVariables: DebtsAsLenderInput;
};

const PaymentsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  debtId,
  queryVariables,
}) => {
  const query = api.debts.getPaymentsAsLender.useQuery(
    { debtId },
    {
      enabled: open,
      staleTime: TimeInMs.FiveSeconds,
      cacheTime: TimeInMs.FiveSeconds,
      refetchOnWindowFocus: false,
    }
  );
  const payments = query.data?.payments ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Pagos</Dialog.Title>

          <Dialog.Description>
            Aquí se mostrarán los pagos realizados por los deudores. También
            podrás confirmar los pagos que te hagan.
          </Dialog.Description>
        </Dialog.Header>

        {query.isFetching ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-center">No hay pagos para mostrar.</p>
        ) : (
          <ScrollArea className="h-[500px]">
            {payments.map((payment) => (
              <PaymentRow
                payment={payment}
                debtId={debtId}
                queryVariables={queryVariables}
                key={payment.id}
              />
            ))}
          </ScrollArea>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

export default PaymentsDialog;
