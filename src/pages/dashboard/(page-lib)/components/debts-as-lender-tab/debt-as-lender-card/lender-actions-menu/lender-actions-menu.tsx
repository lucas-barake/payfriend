import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import * as LucideIcons from "lucide-react";
import { AttentionIndicator } from "$/components/common/attention-indicator/attention-indicator";
import ArchiveDialog from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/archive-dialog";
import BorrowersDialog from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/borrowers-dialog";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/get-debts/debts-as-lender/input";
import PaymentsDialog from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/payments-dialog";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/get-debts/debts-as-lender/types";

type Props = {
  debt: DebtsAsLenderResult["debts"][number];
  hasPendingConfirmations: boolean;
  queryVariables: DebtsAsLenderInput;
};

const LenderActionsMenu: React.FC<Props> = ({
  debt,
  hasPendingConfirmations,
  queryVariables,
}) => {
  const [openArchiveDialog, setOpenArchiveDialog] = React.useState(false);
  const [openPaymentsDialog, setOpenPaymentsDialog] = React.useState(false);
  const [openBorrowersDialog, setOpenBorrowersDialog] = React.useState(false);

  return (
    <>
      <ArchiveDialog
        debt={debt}
        open={openArchiveDialog}
        onOpenChange={setOpenArchiveDialog}
      />

      <PaymentsDialog
        open={openPaymentsDialog}
        onOpenChange={setOpenPaymentsDialog}
        debtId={debt.id}
        queryVariables={queryVariables}
      />

      <BorrowersDialog
        open={openBorrowersDialog}
        onOpenChange={setOpenBorrowersDialog}
        debtId={debt.id}
      />

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" className="relative flex items-center gap-1.5">
            <LucideIcons.Settings className="h-4 w-4" />
            <span className="sr-only">Más</span>

            {hasPendingConfirmations && <AttentionIndicator />}
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Acciones</DropdownMenu.Label>

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onClick={() => {
              setOpenPaymentsDialog(true);
            }}
            className="cursor-pointer"
            highlight={hasPendingConfirmations}
          >
            <button
              type="button"
              className="relative flex w-full items-center gap-1.5"
            >
              <LucideIcons.UserCheck className="h-4 w-4" />
              Ver Pagos
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => {
              setOpenBorrowersDialog(true);
            }}
          >
            <button type="button" className="flex w-full items-center gap-1.5">
              <LucideIcons.Users className="h-4 w-4" />
              <span>Deudores</span>
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              setOpenArchiveDialog(true);
            }}
            className="cursor-pointer"
          >
            <button type="button" className="flex w-full items-center gap-1.5">
              <LucideIcons.BadgeCheck className="h-4 w-4" />
              <span>Finalizar</span>
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};

export default LenderActionsMenu;
