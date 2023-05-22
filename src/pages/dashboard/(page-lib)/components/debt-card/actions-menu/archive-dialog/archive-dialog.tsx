import React from "react";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { type AppRouter } from "$/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";
import { Dialog } from "$/components/ui/dialog";
import { AlertTriangle, Archive } from "lucide-react";
import { Button } from "$/components/ui/button";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["debts"]["getSharedDebts"]>
  >["debtsAsBorrower"][number]["debt"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ArchiveDialog: React.FC<Props> = ({ debt, open, onOpenChange }) => {
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
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="flex items-center justify-center gap-2 sm:justify-start">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Archivar Deuda
          </Dialog.Title>
          <Dialog.Description>
            Al archivar la deuda, se considerará completada y permanecerá
            inactiva de forma permanente. No podrás realizar cambios ni
            transacciones relacionadas con esta deuda, pero aún podrás verla.
            Esta acción no se puede deshacer.
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
  );
};

export default ArchiveDialog;
