import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import { api } from "$/lib/utils/api";
import { useSession } from "next-auth/react";
import { BorrowerStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { type BorrowerDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-shared-debts/input";
import { type GetSharedDebtsOutput } from "$/server/api/routers/debts/queries/handlers/get-shared-debts/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtId: string;
  queryVariables: BorrowerDebtsQueryInput;
};

const BorrowerConfirmDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  debtId,
  queryVariables,
}) => {
  const session = useSession();
  const apiContext = api.useContext();
  const confirmMutation = api.debts.setPendingConfirmation.useMutation();

  async function handleConfirm(): Promise<void> {
    if (!session.data?.user) return;

    await toast.promise(
      confirmMutation.mutateAsync({
        debtId,
      }),
      {
        loading: "Confirmando pago...",
        success: "Pago confirmado",
        error: handleMutationError,
      }
    );
    apiContext.debts.getSharedDebts.setData(queryVariables, (cachedData) => {
      if (!cachedData) return cachedData;

      return {
        debts: cachedData.debts.map((debt) => {
          if (debt.id === debtId) {
            return {
              ...debt,
              borrowers: debt.borrowers.map((borrower) =>
                borrower.user.id === session.data.user.id
                  ? {
                      ...borrower,
                      status: BorrowerStatus.PENDING_CONFIRMATION,
                    }
                  : borrower
              ),
            };
          }
          return debt;
        }),
        count: cachedData.count,
      } satisfies GetSharedDebtsOutput;
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Confirmar Deuda Pagada</Dialog.Title>
        <Dialog.Description>
          Al confirmar el pago, estás indicando que has realizado el pago
          correspondiente. El prestador luego podrá confirmarlo.
        </Dialog.Description>

        <Dialog.Footer>
          <Button
            size="sm"
            onClick={() => {
              void handleConfirm();
            }}
            loading={confirmMutation.isLoading}
          >
            Confirmar
          </Button>

          <Dialog.Trigger asChild>
            <Button variant="secondary" size="sm">
              Cancelar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default BorrowerConfirmDialog;
