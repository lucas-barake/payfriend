import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import * as LucideIcons from "lucide-react";
import { InfoIcon } from "lucide-react";
import { AttentionIndicator } from "$/components/common/attention-indicator/attention-indicator";
import ArchiveDialog from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/archive-dialog";
import BorrowersDialog from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/borrowers-dialog";
import PaymentsDialog from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/payments-dialog";
import RecurringCyclesDialog from "$/pages/dashboard/(page-lib)/components/recurring-cycles-dialog";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/queries/types";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/queries/input";

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
  const isRecurrent =
    debt.recurringFrequency !== null && debt.duration !== null;
  const [openRecurringCyclesDialog, setOpenRecurringCyclesDialog] =
    React.useState(false);

  return (
    <React.Fragment>
      <ArchiveDialog
        debt={debt}
        open={openArchiveDialog}
        onOpenChange={setOpenArchiveDialog}
      />

      <PaymentsDialog
        open={openPaymentsDialog}
        onOpenChange={setOpenPaymentsDialog}
        debt={debt}
        queryVariables={queryVariables}
      />

      <BorrowersDialog
        open={openBorrowersDialog}
        onOpenChange={setOpenBorrowersDialog}
        debt={debt}
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
            className="flex w-full cursor-pointer items-center gap-1.5"
            highlight={hasPendingConfirmations}
          >
            <LucideIcons.UserCheck className="h-4 w-4" />
            Ver Pagos
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex w-full cursor-pointer items-center gap-1.5"
            onClick={() => {
              setOpenBorrowersDialog(true);
            }}
          >
            <LucideIcons.Users className="h-4 w-4" />
            Deudores
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

          <DropdownMenu.Item
            onClick={() => {
              setOpenArchiveDialog(true);
            }}
            className="flex w-full cursor-pointer items-center gap-1.5"
            disabled={debt.archived !== null}
            destructive
          >
            <LucideIcons.BadgeCheck className="h-4 w-4" />
            Concluir
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </React.Fragment>
  );
};

export default LenderActionsMenu;
