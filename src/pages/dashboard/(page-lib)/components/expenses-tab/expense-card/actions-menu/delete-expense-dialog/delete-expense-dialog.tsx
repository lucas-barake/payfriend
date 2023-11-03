import React from "react";
import { type GetPersonalExpensesResult } from "$/server/api/routers/personal-expenses/queries/types";
import { api } from "$/lib/utils/api";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";

type Props = {
  expense: GetPersonalExpensesResult["expenses"][number];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteExpenseDialog: React.FC<Props> = ({ expense, open, setOpen }) => {
  const apiUtils = api.useUtils();
  const deleteMutation = api.personalExpenses.delete.useMutation();

  async function handleDelete(): Promise<void> {
    await toast.promise(
      deleteMutation.mutateAsync({
        id: expense.id,
      }),
      {
        loading: "Eliminando gasto...",
        success: "¡Gasto eliminado!",
        error: handleMutationError,
      }
    );
    await apiUtils.personalExpenses.get.invalidate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content destructive>
        <Dialog.Header>
          <Dialog.Title>Eliminar Gasto</Dialog.Title>

          <Dialog.Description>
            ¿Estás seguro que deseas eliminar este gasto? Esta acción no se
            puede deshacer.
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Footer>
          <Button
            variant="destructive"
            onClick={() => {
              void handleDelete();
            }}
            loading={deleteMutation.isLoading}
          >
            Eliminar
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancelar
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default DeleteExpenseDialog;
