import React from "react";
import { type DebtsAsBorrowerResult } from "$/server/api/routers/debts/get-debts/debts-as-borrower/types";
import { Dialog } from "$/components/ui/dialog";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { ScrollArea } from "$/components/ui/scroll-area";
import { Loader } from "$/components/ui/loader";
import PaymentRow from "$/pages/dashboard/(page-lib)/components/debts-as-borrower-tab/debt-as-borrower-card/borrower-actions-menu/view-own-payments-dialog/payment-row";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/get-debts/debts-as-borrower/input";

type Props = {
  debt: DebtsAsBorrowerResult["debts"][number];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryVariables: DebtsAsBorrowerInput;
};

const ViewOwnPaymentsDialog: React.FC<Props> = ({
  debt,
  open,
  onOpenChange,
  queryVariables,
}) => {
  const query = api.debts.getPaymentsAsBorrower.useQuery(
    {
      debtId: debt.id,
    },
    {
      enabled: open,
      cacheTime: TimeInMs.FiveSeconds,
      staleTime: TimeInMs.FiveSeconds,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
  const payments = query.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Pagos</Dialog.Title>

          <Dialog.Description>
            Acá podrás ver los pagos que has realizado para esta deuda.
          </Dialog.Description>
        </Dialog.Header>

        {query.isFetching ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-center">No hay pagos para mostrar.</p>
        ) : (
          <ScrollArea className="h-[500px]">
            {payments.map((payment) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                debtId={debt.id}
                queryVariables={queryVariables}
              />
            ))}
          </ScrollArea>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

export default ViewOwnPaymentsDialog;
