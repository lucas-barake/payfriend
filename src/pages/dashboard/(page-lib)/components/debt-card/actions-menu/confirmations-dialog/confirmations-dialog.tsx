import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Button } from "$/components/ui/button";
import UserRow from "$/pages/dashboard/(page-lib)/components/debt-card/actions-menu/confirmations-dialog/user-row";
import { type LenderDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/input";
import { Loader } from "$/components/ui/loader";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtId: string;
  queryVariables: LenderDebtsQueryInput;
};

const ConfirmationsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  debtId,
  queryVariables,
}) => {
  const query = api.debts.getPendingConfirmations.useQuery(
    {
      debtId,
    },
    {
      staleTime: TimeInMs.TenSeconds,
      cacheTime: TimeInMs.TenSeconds,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      enabled: open,
    }
  );
  const pendingConfirmations = query.data?.pendingConfirmations ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Confirmar Pagos</Dialog.Title>
          <Dialog.Description>
            Al confirmar el pago, estás indicando que el deudor ha realizado el
            pago correspondiente.
          </Dialog.Description>
        </Dialog.Header>

        {query.isFetching ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : pendingConfirmations.length === 0 ? (
          <p className="text-center text-foreground">
            No hay pagos pendientes de confirmación.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingConfirmations.map((pendingConfirmation) => (
              <UserRow
                user={pendingConfirmation.user}
                key={pendingConfirmation.user.id}
                debtId={debtId}
                queryVariables={queryVariables}
              />
            ))}
          </div>
        )}

        <Dialog.Footer>
          <Dialog.Trigger asChild>
            <Button variant="tertiary" size="sm">
              Cerrar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default ConfirmationsDialog;
