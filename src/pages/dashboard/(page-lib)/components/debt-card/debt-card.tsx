import React, { type FC } from "react";
import { DateTime } from "luxon";
import { type AppRouter } from "$/server/api/root";
import { Archive, CalendarIcon, Eye, MoreHorizontal } from "lucide-react";
import { Skeleton } from "$/components/ui/skeleton";
import { type inferProcedureOutput } from "@trpc/server";
import { Button } from "$/components/ui/button";
import { Badge } from "$/components/ui/badge";
import { Avatar } from "$/components/ui/avatar";
import { DropdownMenu } from "$/components/ui/dropdown-menu";

type Props = {
  debt: NonNullable<
    inferProcedureOutput<AppRouter["user"]["getSharedDebts"]>
  >["debtsAsBorrower"][number]["debt"];
  lender?: boolean;
};

const DebtCard: FC<Props> & {
  Skeleton: FC;
} = ({ debt, lender = false }) => {
  const normalizedBorrowers = debt.borrowers.map(({ user }) => user);
  const members = [debt.lender, ...normalizedBorrowers];

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-6 shadow-sm transition-colors duration-200 ease-in hover:bg-background-secondary/70">
      <div className="flex w-full items-center justify-between gap-4">
        <span className="max-w-[250px] text-lg font-bold">{debt.name}</span>

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

        {lender && (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1.5"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Más</span>
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
              <DropdownMenu.Label>Acciones</DropdownMenu.Label>

              <DropdownMenu.Separator />

              <DropdownMenu.Item>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  <span>Ver</span>
                </button>
              </DropdownMenu.Item>

              <DropdownMenu.Item>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-1.5"
                >
                  <Archive className="h-4 w-4" />
                  <span>Archivar</span>
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

const GroupCardSkeleton: FC = () => (
  <Skeleton className="flex h-48 flex-col gap-2 rounded-lg p-6" />
);

DebtCard.Skeleton = GroupCardSkeleton;
export default DebtCard;
