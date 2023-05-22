import React, { type FC } from "react";
import { DateTime } from "luxon";
import { type AppRouter } from "$/server/api/root";
import { Archive, BadgeCheck, CalendarIcon } from "lucide-react";
import { Skeleton } from "$/components/ui/skeleton";
import { type inferProcedureOutput } from "@trpc/server";
import { Button } from "$/components/ui/button";
import { Badge } from "$/components/ui/badge";
import { Avatar } from "$/components/ui/avatar";
import { useSession } from "next-auth/react";
import { BorrowerStatus } from "@prisma/client";
import BorrowerConfirmDialog from "src/pages/dashboard/(page-lib)/components/debt-card/borrower-confirm-dialog";
import ActionsMenu from "$/pages/dashboard/(page-lib)/components/debt-card/actions-menu";
import { cn } from "$/lib/utils/cn";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["debts"]["getSharedDebts"]>
  >["debtsAsBorrower"][number]["debt"];
  lender?: boolean;
};

const BaseDebtCard: FC<Props> = ({ debt, lender = false }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const session = useSession();
  const currentBorrower = debt.borrowers.find(
    ({ user }) => user.id === session.data?.user?.id
  );
  const paymentStatus = currentBorrower?.status ?? BorrowerStatus.YET_TO_PAY;
  const normalizedBorrowers = debt.borrowers.map(({ user }) => user);
  const members = [debt.lender, ...normalizedBorrowers];
  const hasPendingConfirmations =
    debt.borrowers.filter(
      ({ status }) => status === BorrowerStatus.PENDING_CONFIRMATION
    ).length > 0;

  return (
    <>
      <BorrowerConfirmDialog
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        debtId={debt.id}
      />

      <div
        className={cn(
          "relative flex flex-col gap-2 rounded-lg border border-border p-6 shadow-sm",
          debt.archived && "pointer-events-none select-none"
        )}
      >
        {debt.archived && (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-lg bg-background/50">
            <div className="flex h-full items-center justify-center">
              <Archive className="h-12 w-12 text-foreground" />
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

        <Badge className="self-start rounded-sm text-base" variant="success">
          💵 {debt.amount.toLocaleString()}
        </Badge>

        <p className="mb-6 mt-2 pr-2 lg:pr-3 xl:pr-6">{debt.description}</p>

        <div className="mt-auto flex w-full items-center justify-between">
          <Badge variant="secondary">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {DateTime.fromJSDate(debt.createdAt).toLocaleString(
              DateTime.DATE_MED
            )}
          </Badge>

          {lender ? (
            <ActionsMenu
              debt={debt}
              hasPendingConfirmations={hasPendingConfirmations}
            />
          ) : (
            <Button
              size="sm"
              className="text-sm"
              disabled={
                paymentStatus === BorrowerStatus.CONFIRMED ||
                paymentStatus === BorrowerStatus.PENDING_CONFIRMATION
              }
              variant={
                paymentStatus === BorrowerStatus.YET_TO_PAY
                  ? "default"
                  : paymentStatus === BorrowerStatus.PENDING_CONFIRMATION
                  ? "secondary"
                  : "success"
              }
              onClick={() => {
                if (paymentStatus === BorrowerStatus.YET_TO_PAY) {
                  setOpenConfirmDialog(true);
                }
              }}
            >
              {paymentStatus === BorrowerStatus.YET_TO_PAY ? (
                <>
                  <span className="xs:mr-1">Confirmar</span>{" "}
                  <span className="hidden xs:inline">Pago</span>
                </>
              ) : paymentStatus === BorrowerStatus.PENDING_CONFIRMATION ? (
                "Pendiente"
              ) : (
                <>
                  <BadgeCheck className="mr-1 h-4 w-4" />
                  <span>Pagado</span>
                </>
              )}
            </Button>
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
