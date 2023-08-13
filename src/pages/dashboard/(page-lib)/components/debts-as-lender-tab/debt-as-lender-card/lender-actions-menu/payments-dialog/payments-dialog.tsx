import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/get-debts/debts-as-lender/input";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Loader } from "$/components/ui/loader";
import { ScrollArea } from "$/components/ui/scroll-area";
import PaymentRow from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/payments-dialog/payment-row";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/get-debts/debts-as-lender/types";
import BorrowerRow from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/payments-dialog/borrower-row";
import { Button } from "$/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: DebtsAsLenderResult["debts"][number];
  queryVariables: DebtsAsLenderInput;
};

const PaymentsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  debt,
  queryVariables,
}) => {
  const [selectedBorrowerId, setSelectedBorrowerId] = React.useState<
    string | null
  >(null);
  const viewingBorrower = selectedBorrowerId !== null;
  const borrowers = debt.borrowers;
  const query = api.debts.getPaymentsAsLender.useQuery(
    { debtId: debt.id },
    {
      enabled: open && selectedBorrowerId !== null,
      staleTime: TimeInMs.FiveSeconds,
      cacheTime: TimeInMs.FiveSeconds,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
  const payments = query.data?.payments ?? [];
  const sortedPayments = payments.sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  const filteredPayments = sortedPayments.filter(
    (payment) => payment.borrower.user.id === selectedBorrowerId
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setSelectedBorrowerId(null);
        onOpenChange(open);
      }}
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Pagos</Dialog.Title>

          <Dialog.Description>
            Aquí se mostrarán los pagos realizados por los deudores. También
            podrás confirmar los pagos que te hagan.
          </Dialog.Description>
        </Dialog.Header>

        {!viewingBorrower && (
          <div className="flex flex-col gap-1.5">
            {borrowers.map((borrower) => (
              <BorrowerRow
                key={borrower.user.id}
                setSelectedBorrowerId={setSelectedBorrowerId}
                borrower={borrower}
                currency={debt.currency}
              />
            ))}
          </div>
        )}

        {viewingBorrower && (
          <React.Fragment>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedBorrowerId(null);
              }}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Volver
            </Button>

            <ScrollArea className="h-[500px]">
              {query.isFetching ? (
                <div className="flex items-center justify-center">
                  <Loader />
                </div>
              ) : filteredPayments.length === 0 ? (
                <p className="text-center">No hay pagos para mostrar.</p>
              ) : (
                <React.Fragment>
                  {filteredPayments.map((payment) => (
                    <PaymentRow
                      payment={payment}
                      debt={debt}
                      queryVariables={queryVariables}
                      key={payment.id}
                    />
                  ))}
                </React.Fragment>
              )}
            </ScrollArea>
          </React.Fragment>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

export default PaymentsDialog;
