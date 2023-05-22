import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PendingConfirmDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Confirmar Deuda Pagada</Dialog.Title>
        <Dialog.Description>
          Al confirmar el pago, estás indicando que has realizado el pago
          correspondiente. El prestador luego podrá confirmarlo.
        </Dialog.Description>

        <Dialog.Footer>
          <Button size="sm">Confirmar</Button>

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

export default PendingConfirmDialog;
