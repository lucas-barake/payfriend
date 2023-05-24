import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import { Archive, MoreHorizontal, UserCheck, Users } from "lucide-react";
import { type AppRouter } from "$/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";
import { AttentionIndicator } from "$/components/common/attention-indicator/attention-indicator";
import ArchiveDialog from "$/pages/dashboard/(page-lib)/components/debt-card/actions-menu/archive-dialog";
import ConfirmationsDialog from "$/pages/dashboard/(page-lib)/components/debt-card/actions-menu/confirmations-dialog";
import BorrowersDialog from "$/pages/dashboard/(page-lib)/components/debt-card/actions-menu/borrowers-dialog";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["debts"]["getSharedDebts"]>
  >["debtsAsBorrower"][number]["debt"];
  hasPendingConfirmations: boolean;
};

const ActionsMenu: React.FC<Props> = ({ debt, hasPendingConfirmations }) => {
  const [openArchiveDialog, setOpenArchiveDialog] = React.useState(false);
  const [openConfirmationsDialog, setOpenConfirmationsDialog] =
    React.useState(false);
  const [showBorrowersDialog, setShowBorrowersDialog] = React.useState(false);

  return (
    <>
      <ArchiveDialog
        debt={debt}
        open={openArchiveDialog}
        onOpenChange={setOpenArchiveDialog}
      />

      <ConfirmationsDialog
        open={openConfirmationsDialog}
        onOpenChange={setOpenConfirmationsDialog}
        debtId={debt.id}
      />

      <BorrowersDialog
        open={showBorrowersDialog}
        onOpenChange={setShowBorrowersDialog}
        debtId={debt.id}
      />

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="relative flex items-center gap-1.5"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Más</span>

            {hasPendingConfirmations && <AttentionIndicator />}
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Label>Acciones</DropdownMenu.Label>

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onClick={() => {
              setOpenConfirmationsDialog(true);
            }}
            className="cursor-pointer"
          >
            <button
              type="button"
              className="relative flex w-full items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4" />
              Confirmar Pagos
              {hasPendingConfirmations && (
                <AttentionIndicator containerClassName="-top-0.5 -mr-2" />
              )}
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => {
              setShowBorrowersDialog(true);
            }}
          >
            <button type="button" className="flex w-full items-center gap-1.5">
              <Users className="h-4 w-4" />
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
              <Archive className="h-4 w-4" />
              <span>Archivar</span>
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};

export default ActionsMenu;