import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import { AlertTriangle, Archive, Eye, MoreHorizontal } from "lucide-react";
import { Dialog } from "$/components/ui/dialog";
import { api } from "$/lib/utils/api";
import { type AppRouter } from "$/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["debts"]["getSharedDebts"]>
  >["debtsAsBorrower"][number]["debt"];
};

const ActionsMenu: React.FC<Props> = ({ debt }) => {
  const [openArchiveDialog, setOpenArchiveDialog] = React.useState(false);
  const apiContext = api.useContext();
  const archiveMutation = api.debts.archiveDebt.useMutation();

  async function handleArchive(): Promise<void> {
    await toast.promise(
      archiveMutation.mutateAsync({
        debtId: debt.id,
      }),
      {
        loading: "Archivando deuda...",
        success: "Deuda archivada",
        error: handleMutationError,
      }
    );
    await apiContext.debts.getOwnedDebts.invalidate();
    setOpenArchiveDialog(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1.5"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Más</span>
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Label>Acciones</DropdownMenu.Label>

          <DropdownMenu.Separator />

          <DropdownMenu.Item>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-1.5"
            >
              <Eye className="h-4 w-4" />
              <span>Ver</span>
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

      <Dialog open={openArchiveDialog} onOpenChange={setOpenArchiveDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title className="flex items-center justify-center gap-2 sm:justify-start">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Archivar Deuda
            </Dialog.Title>
            <Dialog.Description>
              <p>
                Al archivar la deuda, se considerará completada y permanecerá
                inactiva de forma permanente. No podrás realizar cambios ni
                transacciones relacionadas con esta deuda, pero aún podrás
                verla. Esta acción no se puede deshacer.
              </p>
            </Dialog.Description>

            <Dialog.Footer>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  void handleArchive();
                }}
                loading={archiveMutation.isLoading}
              >
                <Archive className="mr-1.5 h-4 w-4" />
                Archivar
              </Button>

              <Dialog.Trigger asChild>
                <Button variant="secondary" size="sm">
                  Cancelar
                </Button>
              </Dialog.Trigger>
            </Dialog.Footer>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>
    </>
  );
};

export default ActionsMenu;
