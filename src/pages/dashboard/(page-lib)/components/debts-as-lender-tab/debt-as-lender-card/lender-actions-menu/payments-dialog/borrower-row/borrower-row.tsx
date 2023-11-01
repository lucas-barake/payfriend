import React from "react";
import { Card } from "$/components/ui/card";
import DebtCard from "$/pages/dashboard/(page-lib)/components/debt-card";
import { formatCurrency } from "$/lib/utils/format-currency";
import { Button } from "$/components/ui/button";
import { EyeIcon } from "lucide-react";
import { PaymentStatus } from "@prisma/client";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/queries/types";

type Props = {
  setSelectedBorrowerId: React.Dispatch<React.SetStateAction<string | null>>;
  borrower: DebtsAsLenderResult["debts"][number]["borrowers"][number];
  currency: string;
};

const BorrowerRow: React.FC<Props> = ({
  setSelectedBorrowerId,
  borrower,
  currency,
}) => {
  const pendingConfirmation = borrower.payments.some(
    (payment) => payment.status === PaymentStatus.PENDING_CONFIRMATION
  );
  return (
    <Card
      key={borrower.user.id}
      className="flex flex-col justify-between gap-2 px-3 py-2 text-sm sm:flex-row sm:items-center"
    >
      <div className="flex items-center gap-2">
        <DebtCard.MemberAvatar
          image={borrower.user.image}
          fallback={
            borrower.user.name?.at(0) ?? borrower.user.email?.at(0) ?? "?"
          }
        />

        <div className="flex flex-col">
          <span className="flex items-center gap-2">{borrower.user.name}</span>

          <span className="break-all text-sm text-muted-foreground">
            {borrower.user.email}
          </span>

          <span className="text-sm text-warning-text">
            Saldo: {formatCurrency(borrower.balance, currency)}
          </span>
        </div>
      </div>

      <Button
        variant={pendingConfirmation ? "highlight" : "default"}
        size="sm"
        className="text-sm"
        onClick={() => {
          setSelectedBorrowerId(borrower.user.id);
        }}
      >
        <EyeIcon className="mr-1.5 h-4 w-4" />
        Ver Pagos
      </Button>
    </Card>
  );
};

export default BorrowerRow;
