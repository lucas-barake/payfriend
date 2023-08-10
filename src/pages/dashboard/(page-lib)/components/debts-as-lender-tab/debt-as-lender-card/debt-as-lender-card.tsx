import React from "react";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/get-debts/debts-as-lender/input";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import { Popover } from "$/components/ui/popover";
import { Button } from "$/components/ui/button";
import { PaymentStatus } from "@prisma/client";
import LenderActionsMenu from "src/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu";
import { Separator } from "$/components/ui/separator";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/get-debts/debts-as-lender/types";

type Props = {
  debt: DebtsAsLenderResult["debts"][number];
  queryVariables: DebtsAsLenderInput;
};

const DebtAsLenderCard: React.FC<Props> = ({ debt, queryVariables }) => {
  const normalizedBorrowers = debt.borrowers.map(({ user }) => user);
  const members = [debt.lender, ...normalizedBorrowers];
  const hasPendingConfirmations = debt.borrowers.some((borrower) =>
    borrower.payments.some(
      ({ status }) => status === PaymentStatus.PENDING_CONFIRMATION
    )
  );

  return (
    <DebtCard isConcluded={debt.archived !== null}>
      <DebtCard.Header>
        <DebtCard.Title>{debt.name}</DebtCard.Title>

        <DebtCard.AvatarContainer>
          <Popover>
            <Popover.Trigger asChild>
              <Button variant="ghost" className="flex h-10 -space-x-2 px-2">
                {members.map((user) => (
                  <DebtCard.MemberAvatar
                    key={user.id}
                    image={user.image}
                    fallback={
                      user.name?.[0]?.toUpperCase() ??
                      user.email?.[0]?.toUpperCase() ??
                      "?"
                    }
                  />
                ))}
              </Button>
            </Popover.Trigger>

            <Popover.Content align="end" className="w-60">
              <div className="flex flex-col gap-2">
                {members.map((user) => (
                  <React.Fragment key={user.id}>
                    <span className="text-sm font-bold">
                      {user.name ?? "Sin nombre"}{" "}
                      {user.id === debt.lender.id && "(Tú)"}
                    </span>

                    <span className="text-xs text-foreground/50">
                      {user.email}
                    </span>

                    <Separator className="last:hidden" />
                  </React.Fragment>
                ))}
              </div>
            </Popover.Content>
          </Popover>
        </DebtCard.AvatarContainer>
      </DebtCard.Header>

      <DebtCard.BadgeContainer>
        <DebtCard.AmountBadge amount={debt.amount} />

        <DebtCard.DueDateBadge
          dueDate={debt.dueDate}
          recurringFrequency={debt.recurringFrequency}
          createdAt={debt.createdAt}
          duration={debt.duration}
        />
      </DebtCard.BadgeContainer>

      <DebtCard.Description>{debt.description}</DebtCard.Description>

      <DebtCard.Footer>
        <DebtCard.CreatedAtBadge createdAt={debt.createdAt} />

        <LenderActionsMenu
          debt={debt}
          queryVariables={queryVariables}
          hasPendingConfirmations={hasPendingConfirmations}
        />
      </DebtCard.Footer>
    </DebtCard>
  );
};

export default DebtAsLenderCard;
