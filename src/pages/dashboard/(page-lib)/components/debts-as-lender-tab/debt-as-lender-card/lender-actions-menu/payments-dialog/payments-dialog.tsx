import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/get-debts/debts-as-lender/input";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Loader } from "$/components/ui/loader";
import { ScrollArea } from "$/components/ui/scroll-area";
import PaymentRow from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/payments-dialog/payment-row";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/get-debts/debts-as-lender/types";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import { ChevronDown } from "lucide-react";

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
  const query = api.debts.getPaymentsAsLender.useQuery(
    { debtId: debt.id },
    {
      enabled: open,
      staleTime: TimeInMs.FiveSeconds,
      cacheTime: TimeInMs.FiveSeconds,
      refetchOnWindowFocus: false,
    }
  );
  const payments = query.data?.payments ?? [];
  const [filteredBorrowersIds, setFilteredBorrowersIds] = React.useState<
    string[]
  >(debt.borrowers.map((borrower) => borrower.user.id));
  const filteredPayments = payments.filter((payment) =>
    filteredBorrowersIds.includes(payment.borrower.user.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Pagos</Dialog.Title>

          <Dialog.Description>
            Aquí se mostrarán los pagos realizados por los deudores. También
            podrás confirmar los pagos que te hagan.
          </Dialog.Description>

          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" className="mt-2 self-end">
                Deudores
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content align="end">
              {payments.map((payment) => (
                <DropdownMenu.CheckboxItem
                  key={payment.id}
                  checked={filteredBorrowersIds.includes(
                    payment.borrower.user.id
                  )}
                  onSelect={(event): void => {
                    event.preventDefault();
                  }}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilteredBorrowersIds((ids) => [
                        ...ids,
                        payment.borrower.user.id,
                      ]);
                    } else {
                      setFilteredBorrowersIds((ids) =>
                        ids.filter((id) => id !== payment.borrower.user.id)
                      );
                    }
                  }}
                >
                  {payment.borrower.user.email}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu>
        </Dialog.Header>

        {query.isFetching ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            {filteredPayments.length === 0 ? (
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
        )}
      </Dialog.Content>
    </Dialog>
  );
};

export default PaymentsDialog;
