import React, { type FC } from "react";
import { DateTime } from "luxon";
import { type AppRouter } from "$/server/api/root";
import { CalendarIcon, EyeIcon } from "lucide-react";
import { Skeleton } from "$/components/ui/skeleton";
import { type inferProcedureOutput } from "@trpc/server";
import { strTransformer } from "$/lib/utils/str-transformer";
import { Avatar } from "$/components/ui/avatar";
import { buttonVariants } from "$/components/ui/button";
import { Badge } from "$/components/ui/badge";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["user"]["getSharedDebts"]>
  >["debtsAsBorrower"][number]["debt"];
};

const DebtCard: FC<Props> & {
  Skeleton: FC;
} = ({ debt }) => {
  const normalizedBorrowers = debt.borrowers.map(({ user }) => user);
  const members = [debt.lender, ...normalizedBorrowers];

  return (
    <button
      type="button"
      key={debt.id}
      className="flex flex-col gap-2 rounded-lg border border-border p-6 shadow-sm transition-colors duration-200 ease-in hover:bg-background-secondary/70"
    >
      <div className="flex w-full items-center justify-between gap-4 text-lg font-bold text-indigo-500 dark:text-indigo-400">
        <span className="truncate">{debt.name}</span>

        <div className="flex -space-x-2 overflow-hidden">
          {members.map((user) => (
            <Avatar key={user.name} className="h-7 w-7">
              <Avatar.Image src={user.image ?? undefined} />

              <Avatar.Fallback>
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </Avatar.Fallback>
            </Avatar>
          ))}
        </div>
      </div>

      <span className="mb-6 mt-2 pr-2 lg:pr-3 xl:pr-6">
        {strTransformer.truncate(debt.description, 80)}
      </span>

      <div className="mt-auto flex w-full items-center justify-between">
        <Badge variant="secondary">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {DateTime.fromJSDate(debt.createdAt).toLocaleString(
            DateTime.DATE_MED
          )}
        </Badge>

        <div
          className={buttonVariants({
            size: "sm",
            variant: "outline",
            className: "flex items-center gap-1.5",
          })}
        >
          <EyeIcon className="h-5 w-5" />
          <span className="sr-only xs:not-sr-only">Ver</span>
        </div>
      </div>
    </button>
  );
};

const GroupCardSkeleton: FC = () => (
  <Skeleton className="flex h-48 flex-col gap-2 rounded-lg p-6" />
);

DebtCard.Skeleton = GroupCardSkeleton;
export default DebtCard;
