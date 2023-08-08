import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/queries/handlers/debts-as-lender/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtId: string;
  queryVariables: DebtsAsLenderInput;
};

const PaymentsDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Pagos</Dialog.Title>

          <Dialog.Description>
            Aquí se mostrarán los pagos realizados por los deudores. También
            podrás confirmar los pagos que te hagan.
          </Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog>
  );
};

export default PaymentsDialog;
