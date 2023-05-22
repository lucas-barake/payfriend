import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import { Archive, MoreHorizontal, Settings, UserCheck } from "lucide-react";
import { type AppRouter } from "$/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";
import { AttentionIndicator } from "$/components/common/attention-indicator/attention-indicator";
import ArchiveDialog from "$/pages/dashboard/(page-lib)/components/debt-card/actions-menu/archive-dialog";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["debts"]["getSharedDebts"]>
  >["debtsAsBorrower"][number]["debt"];
  hasPendingConfirmations: boolean;
};

const ActionsMenu: React.FC<Props> = ({ debt, hasPendingConfirmations }) => {
  const [openArchiveDialog, setOpenArchiveDialog] = React.useState(false);

  return (
    <>
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

          <DropdownMenu.Item>
            <button
              type="button"
              className="relative flex w-full cursor-pointer items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4" />
              Confirmar Pagos
              {hasPendingConfirmations && (
                <AttentionIndicator containerClassName="-top-0.5 -mr-2" />
              )}
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-1.5"
            >
              <Settings className="h-4 w-4" />
              <span>Configurar</span>
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-1.5"
              onClick={() => {
                setOpenArchiveDialog(true);
              }}
            >
              <Archive className="h-4 w-4" />
              <span>Archivar</span>
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      <ArchiveDialog
        debt={debt}
        open={openArchiveDialog}
        onOpenChange={() => {
          setOpenArchiveDialog(false);
        }}
      />
    </>
  );
};

export default ActionsMenu;
