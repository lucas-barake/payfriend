import React, { type FC } from "react";
import { DateTime } from "luxon";
import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  CalendarIcon,
  DollarSign,
} from "lucide-react";
import { Skeleton } from "$/components/ui/skeleton";
import { Badge } from "$/components/ui/badge";
import { Avatar } from "$/components/ui/avatar";
import { PaymentStatus, type DebtRecurringFrequency } from "@prisma/client";
import LenderActionsMenu from "src/pages/dashboard/(page-lib)/components/debt-card/lender-actions-menu";
import { cn } from "$/lib/utils/cn";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/queries/handlers/debts-as-lender/input";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/queries/handlers/debts-as-borrower/input";
import BorrowerActionsMenu from "$/pages/dashboard/(page-lib)/components/debt-card/borrower-actions-menu";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/queries/handlers/debts-as-lender/types";
import { type DebtsAsBorrowerResult } from "$/server/api/routers/debts/queries/handlers/debts-as-borrower/types";

const recurringFrequencyMap = new Map<DebtRecurringFrequency, string>([
  ["MONTHLY", "Mensual"],
  ["WEEKLY", "Semanal"],
  ["BIWEEKLY", "Quincenal"],
]);

const interval = {
  WEEKLY: {
    weeks: 1,
  },
  BIWEEKLY: {
    weeks: 2,
  },
  MONTHLY: {
    months: 1,
  },
};

type BorrowerProps = {
  lender: false;
  debt: DebtsAsLenderResult["debts"][number];
  queryVariables: DebtsAsBorrowerInput;
};
type LenderProps = {
  lender: true;
  debt: DebtsAsBorrowerResult["debts"][number];
  queryVariables: DebtsAsLenderInput;
};
type Props = BorrowerProps | LenderProps;

const BaseDebtCard: FC<Props> = ({ debt, lender, queryVariables }) => {
  const normalizedBorrowers = debt.borrowers.map(({ user }) => user);
  const members = [debt.lender, ...normalizedBorrowers];
  const hasPendingConfirmations =
    debt.payments.filter(
      ({ status }) => status === PaymentStatus.PENDING_CONFIRMATION
    ).length > 0;
  const isRecurring =
    debt.recurringFrequency !== null && debt.duration !== null;
  const nextPaymentDate = isRecurring
    ? DateTime.fromJSDate(debt.createdAt).plus(
        interval[debt.recurringFrequency!]
      )
    : null;
  const finalPaymentDate = isRecurring
    ? DateTime.fromJSDate(debt.createdAt).plus({
        ...(debt.recurringFrequency === "MONTHLY" && { month: debt.duration! }),
        ...(debt.recurringFrequency === "WEEKLY" && {
          month: debt.duration! / 4,
        }),
        ...(debt.recurringFrequency === "BIWEEKLY" && {
          month: debt.duration! / 2,
        }),
      })
    : debt.dueDate ?? null;
  const endsToday =
    finalPaymentDate !== null && finalPaymentDate <= DateTime.now();
  const createdAt = DateTime.fromJSDate(debt.createdAt).toLocaleString(
    DateTime.DATE_MED
  );

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col gap-3 rounded-lg border border-border p-6 shadow-sm",
          debt.archived && "pointer-events-none select-none"
        )}
      >
        {debt.archived && (
          <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center rounded-lg bg-background/50">
            <div className="flex h-full items-center justify-center">
              <BadgeCheck className="h-12 w-12 text-foreground" />
            </div>
          </div>
        )}

        <div className="flex w-full items-center justify-between gap-4">
          <span className="max-w-[250px] text-lg font-bold">{debt.name}</span>

          <div className="flex -space-x-2 overflow-hidden">
            {members.map((user) => (
              <Avatar key={user.email} className="h-7 w-7">
                <Avatar.Image src={user.image ?? undefined} />

                <Avatar.Fallback>
                  {user.name?.[0]?.toUpperCase() ??
                    user.email?.[0]?.toUpperCase() ??
                    "?"}
                </Avatar.Fallback>
              </Avatar>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-1.5">
          <Badge variant="success">
            <DollarSign className="mr-1.5 h-3.5 w-3.5" />
            {debt.amount.toLocaleString()}
          </Badge>

          {isRecurring && (
            <Badge variant="outline" className="self-start">
              Paga hasta el {nextPaymentDate?.toLocaleString(DateTime.DATE_MED)}
            </Badge>
          )}

          {finalPaymentDate !== null && (
            <Badge
              variant={endsToday ? "destructive" : "outline"}
              className="self-start"
            >
              <CalendarCheck className="mr-1.5 h-3.5 w-3.5" />
              Finaliza {finalPaymentDate.toLocaleString(DateTime.DATE_MED)}
            </Badge>
          )}

          {isRecurring && (
            <Badge variant="outline" className="self-start">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              {recurringFrequencyMap.get(debt.recurringFrequency!)} (
              {debt.duration})
            </Badge>
          )}
        </div>

        <p className="mb-6 mt-2 pr-2 lg:pr-3 xl:pr-6">{debt.description}</p>

        <div className="mt-auto flex w-full items-center justify-between gap-4">
          <Badge variant="outline" className="h-full break-all">
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
            <span>Creada {createdAt}</span>
          </Badge>

          {lender ? (
            <LenderActionsMenu
              debt={debt}
              hasPendingConfirmations={hasPendingConfirmations}
              queryVariables={queryVariables}
            />
          ) : (
            <BorrowerActionsMenu debt={debt} queryVariables={queryVariables} />
          )}
        </div>
      </div>
    </>
  );
};

const DebtCardSkeleton: React.FC = () => (
  <Skeleton className="flex h-48 flex-col gap-2 rounded-lg p-6" />
);

const DebtCard = Object.assign(BaseDebtCard, {
  Skeleton: DebtCardSkeleton,
});
export default DebtCard;
