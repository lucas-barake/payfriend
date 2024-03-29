import React from "react";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";
import { api } from "$/lib/utils/api";
import { Avatar } from "$/components/ui/avatar";
import { Button } from "$/components/ui/button";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { type LenderDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/input";

type Props = {
  user: NonNullable<
    inferProcedureOutput<AppRouter["debts"]["getPendingConfirmations"]>
  >["pendingConfirmations"][number]["user"];
  debtId: string;
  queryVariables: LenderDebtsQueryInput;
};

const UserRow: React.FC<Props> = ({ user, debtId, queryVariables }) => {
  const apiContext = api.useContext();
  const confirmMutation = api.debts.confirmPendingConfirmation.useMutation();

  async function handleConfirm(): Promise<void> {
    await toast.promise(
      confirmMutation.mutateAsync({
        debtId,
        userId: user.id,
      }),
      {
        loading: "Confirmando pago...",
        success: "Pago confirmado",
        error: handleMutationError,
      }
    );

    await apiContext.debts.getOwnedDebts.invalidate(queryVariables);
    apiContext.debts.getPendingConfirmations.setData(
      {
        debtId,
      },
      (cachedData) => {
        if (!cachedData) return cachedData;

        return {
          ...cachedData,
          pendingConfirmations: cachedData.pendingConfirmations.filter(
            (pendingConfirmation) => pendingConfirmation.user.id !== user.id
          ),
        };
      }
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <Avatar.Image src={user.image ?? undefined} />
          <Avatar.Fallback>{user.email?.[0] ?? "?"}</Avatar.Fallback>
        </Avatar>

        <span>{user.email}</span>
      </div>

      <Button
        size="sm"
        variant="success"
        className="text-sm"
        onClick={() => {
          void handleConfirm();
        }}
        loading={confirmMutation.isLoading}
      >
        {!confirmMutation.isLoading && <Check className="h-4 w-4 sm:mr-1" />}
        <span className="sr-only sm:not-sr-only">Confirmar</span>
      </Button>
    </div>
  );
};

export default UserRow;
