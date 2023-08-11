import React from "react";
import { Popover } from "$/components/ui/popover";
import { Button } from "$/components/ui/button";
import * as LucideIcons from "lucide-react";
import { Avatar } from "$/components/ui/avatar";
import { Separator } from "$/components/ui/separator";
import { type GetDebtBorrowersAndPendingBorrowersResult } from "$/server/api/routers/debts/get-debts/get-debt-borrowers-and-pending-borrowers/types";
import { formatCurrency } from "$/lib/utils/format-currency";
import { cn } from "$/lib/utils/cn";
import { type Currency } from "$/server/api/routers/debts/create-debt/input";

type Props = {
  borrower: GetDebtBorrowersAndPendingBorrowersResult["borrowers"][number];
  currency: Currency;
};

const BorrowerRow: React.FC<Props> = ({ borrower, currency }) => {
  return (
    <div className="flex items-center justify-between" key={borrower.user.id}>
      <div className="flex items-center gap-3">
        <Popover>
          <Popover.Trigger asChild>
            <Button variant="outline" className="group relative">
              <span className="sr-only">Ver información del deudor</span>

              <Avatar className="h-6 w-6">
                <Avatar.Image src={borrower.user.image ?? undefined} />

                <Avatar.Fallback>
                  {borrower.user.name?.[0] ?? "?"}
                </Avatar.Fallback>
              </Avatar>

              <span className="ml-2 max-w-[150px] truncate text-foreground xs:max-w-[200px] sm:max-w-[250px]">
                {borrower.user.name ?? "Sin nombre"}
              </span>
            </Button>
          </Popover.Trigger>

          <Popover.Content className="flex flex-col gap-2" align="start">
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <span>{borrower.user.name ?? "Sin nombre"}</span>
              <span className="truncate opacity-50">{borrower.user.email}</span>
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5 text-sm">
              Saldo pendiente:
              <span
                className={cn(
                  borrower.balance === 0
                    ? "text-success-text"
                    : "text-warning-text"
                )}
              >
                {formatCurrency(borrower.balance, currency)}
              </span>
            </div>
          </Popover.Content>
        </Popover>
      </div>

      <Popover>
        <Popover.Trigger asChild>
          <Button size="sm" variant="destructive" className="opacity-50">
            <LucideIcons.UserMinus className="h-5 w-5 sm:mr-1.5" />
            <span className="sr-only sm:not-sr-only">Eliminar</span>
          </Button>
        </Popover.Trigger>

        <Popover.Content>
          <p className="text-sm text-foreground">
            No puedes eliminar a un deudor que ya ha aceptado la invitación.
          </p>
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default BorrowerRow;
