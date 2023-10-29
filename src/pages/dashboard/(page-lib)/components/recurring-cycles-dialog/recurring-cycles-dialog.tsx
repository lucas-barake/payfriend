import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { getRecurrentCycleDates } from "$/pages/dashboard/(page-lib)/utils/get-recurrent-cycle-dates";
import { Card } from "$/components/ui/card";
import { type DebtRecurringFrequency } from "@prisma/client";
import { cn } from "$/lib/utils/cn";
import { CheckIcon } from "lucide-react";
import { getRecurrentDebtFinalPayment } from "$/pages/dashboard/(page-lib)/utils/get-recurrent-debt-final-payment";
import { Separator } from "$/components/ui/separator";

type Props = {
  open: boolean;
  onOpenChange: (newOpen: boolean) => void;
  recurringFrequency: DebtRecurringFrequency;
  duration: number;
  createdAt: Date;
};

const RecurringCyclesDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  recurringFrequency,
  duration,
  createdAt,
}) => {
  const finalPaymentDate = getRecurrentDebtFinalPayment({
    recurringFrequency,
    duration,
    createdAt,
  });
  const isFinalPaymentInPast = Date.now() > finalPaymentDate.toMillis();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Detalles de Recurrencia</Dialog.Title>
        </Dialog.Header>

        <div className="flex flex-col gap-1.5">
          {getRecurrentCycleDates({
            recurringFrequency,
            duration,
            createdAt,
          }).map((cycle, index) => {
            const isPreviousCycle = Date.now() > cycle.toMillis();
            const isCurrentCycle =
              Date.now() > cycle.toMillis() &&
              Date.now() < cycle.plus({ days: duration }).toMillis();
            return (
              <Card
                key={cycle.toUTC().toString()}
                className={cn("flex items-center gap-1 px-3 py-2 text-sm", {
                  "bg-muted": isPreviousCycle && !isCurrentCycle,
                  "bg-primary": isCurrentCycle,
                })}
              >
                {isPreviousCycle && !isCurrentCycle && (
                  <CheckIcon className="h-4 w-4" />
                )}
                <span className="font-semibold">Periodo {index + 1}:</span>{" "}
                {cycle.toFormat("DDDD")}
              </Card>
            );
          })}

          <Separator className="my-2" />

          <Card className="flex items-center gap-1 bg-destructive px-3 py-2 text-sm text-destructive-foreground">
            <span className="font-semibold">
              {isFinalPaymentInPast ? "Finalizado" : "Finaliza"}
            </span>{" "}
            {finalPaymentDate.toFormat("DDDD")}
          </Card>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default RecurringCyclesDialog;
