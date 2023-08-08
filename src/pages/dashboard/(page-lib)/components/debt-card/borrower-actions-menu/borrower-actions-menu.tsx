import React from "react";
import { Button } from "$/components/ui/button";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { EyeIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import AddPaymentDialog from "$/pages/dashboard/(page-lib)/components/debt-card/borrower-actions-menu/add-payment-dialog";
import { type DebtsAsBorrowerResult } from "$/server/api/routers/debts/queries/handlers/debts-as-borrower/types";
import ViewOwnPaymentsDialog from "$/pages/dashboard/(page-lib)/components/debt-card/borrower-actions-menu/view-own-payments-dialog";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/queries/handlers/debts-as-borrower/input";

type Props = {
  debt: DebtsAsBorrowerResult["debts"][number];
  queryVariables: DebtsAsBorrowerInput;
};

const BorrowerActionsMenu: React.FC<Props> = ({ debt, queryVariables }) => {
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = React.useState(false);
  const [openViewOwnPaymentsDialog, setOpenViewOwnPaymentsDialog] =
    React.useState(false);

  return (
    <>
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

          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => {
              setOpenViewOwnPaymentsDialog(true);
            }}
          >
            Prestamista
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};

export default BorrowerActionsMenu;
