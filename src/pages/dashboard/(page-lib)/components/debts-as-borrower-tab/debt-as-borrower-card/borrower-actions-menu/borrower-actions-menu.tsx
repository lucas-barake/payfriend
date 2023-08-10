import React from "react";
import { Button } from "$/components/ui/button";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { EyeIcon, InfoIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import AddPaymentDialog from "$/pages/dashboard/(page-lib)/components/debts-as-borrower-tab/debt-as-borrower-card/borrower-actions-menu/add-payment-dialog";
import { type DebtsAsBorrowerResult } from "$/server/api/routers/debts/get-debts/debts-as-borrower/types";
import ViewOwnPaymentsDialog from "$/pages/dashboard/(page-lib)/components/debts-as-borrower-tab/debt-as-borrower-card/borrower-actions-menu/view-own-payments-dialog";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/get-debts/debts-as-borrower/input";
import { Dialog } from "$/components/ui/dialog";
import { getRecurrentCycleDates } from "$/pages/dashboard/(page-lib)/utils/get-recurrent-cycle-dates";
import { Card } from "$/components/ui/card";

type Props = {
  debt: DebtsAsBorrowerResult["debts"][number];
  queryVariables: DebtsAsBorrowerInput;
};

const BorrowerActionsMenu: React.FC<Props> = ({ debt, queryVariables }) => {
  const isRecurrent =
    debt.recurringFrequency !== null && debt.duration !== null;
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = React.useState(false);
  const [openViewOwnPaymentsDialog, setOpenViewOwnPaymentsDialog] =
    React.useState(false);
  const [openViewRecurrentInfoDialog, setOpenViewRecurrentInfoDialog] =
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

      {isRecurrent && (
        <Dialog
          open={openViewRecurrentInfoDialog}
          onOpenChange={setOpenViewRecurrentInfoDialog}
        >
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Detalles de Recurrencia</Dialog.Title>
            </Dialog.Header>

            <div className="flex flex-col gap-1.5">
              {getRecurrentCycleDates({
                recurringFrequency: debt.recurringFrequency!,
                duration: debt.duration!,
                createdAt: debt.createdAt,
              }).map((cycle, index) => {
                return (
                  <Card key={cycle.toUTC().toString()} className="p-2 text-sm">
                    <span className="font-semibold">Periodo {index + 1}:</span>{" "}
                    {cycle.toFormat("DDDD")}
                  </Card>
                );
              })}
            </div>
          </Dialog.Content>
        </Dialog>
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
                setOpenViewRecurrentInfoDialog(true);
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
    </>
  );
};

export default BorrowerActionsMenu;
