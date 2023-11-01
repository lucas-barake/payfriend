import React from "react";
import { Button } from "$/components/ui/button";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { EyeIcon, InfoIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import AddPaymentDialog from "$/pages/dashboard/(page-lib)/components/debts-as-borrower-tab/debt-as-borrower-card/borrower-actions-menu/add-payment-dialog";
import { type DebtsAsBorrowerResult } from "$/server/api/routers/debts/queries/types";
import ViewOwnPaymentsDialog from "$/pages/dashboard/(page-lib)/components/debts-as-borrower-tab/debt-as-borrower-card/borrower-actions-menu/view-own-payments-dialog";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/queries/input";
import RecurringCyclesDialog from "$/pages/dashboard/(page-lib)/components/recurring-cycles-dialog";

type Props = {
  debt: DebtsAsBorrowerResult["debts"][number];
  queryVariables: DebtsAsBorrowerInput;
  isConcluded: boolean;
};

const BorrowerActionsMenu: React.FC<Props> = ({
  debt,
  queryVariables,
  isConcluded,
}) => {
  const isRecurrent =
    debt.recurringFrequency !== null && debt.duration !== null;
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = React.useState(false);
  const [openViewOwnPaymentsDialog, setOpenViewOwnPaymentsDialog] =
    React.useState(false);
  const [openRecurringCyclesDialog, setOpenRecurringCyclesDialog] =
    React.useState(false);

  return (
    <React.Fragment>
      <AddPaymentDialog
        open={openAddPaymentDialog}
        onOpenChange={setOpenAddPaymentDialog}
        debt={debt}
        queryVariables={queryVariables}
      />

      <ViewOwnPaymentsDialog
        debt={debt}
        open={openViewOwnPaymentsDialog}
        onOpenChange={setOpenViewOwnPaymentsDialog}
        queryVariables={queryVariables}
      />

      {isRecurrent && (
        <RecurringCyclesDialog
          open={openRecurringCyclesDialog}
          onOpenChange={setOpenRecurringCyclesDialog}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- isRecurrent is true
          recurringFrequency={debt.recurringFrequency!}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- isRecurrent is true
          duration={debt.duration!}
          createdAt={debt.createdAt}
        />
      )}

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" className="relative flex items-center gap-1.5">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Más</span>
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Acciones</DropdownMenu.Label>
          <DropdownMenu.Separator />

          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => {
              setOpenAddPaymentDialog(true);
            }}
            disabled={isConcluded}
          >
            <DropdownMenu.Button>
              <PlusIcon className="h-4 w-4" />
              Pagar
            </DropdownMenu.Button>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => {
              setOpenViewOwnPaymentsDialog(true);
            }}
          >
            <DropdownMenu.Button>
              <EyeIcon className="h-4 w-4" />
              Ver Tus Pagos
            </DropdownMenu.Button>
          </DropdownMenu.Item>

          {isRecurrent && (
            <DropdownMenu.Item
              className="cursor-pointer"
              onClick={() => {
                setOpenRecurringCyclesDialog(true);
              }}
            >
              <DropdownMenu.Button>
                <InfoIcon className="h-4 w-4" />
                Detalles de Recurrencia
              </DropdownMenu.Button>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </React.Fragment>
  );
};

export default BorrowerActionsMenu;
