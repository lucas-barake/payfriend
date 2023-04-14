import React, { type FC } from "react";
import Link from "next/link";
import Button from "src/components/ui/button";
import { CalendarIcon, EyeIcon } from "@heroicons/react/outline";
import truncateString from "$/utils/truncate-string";
import { DateTime } from "luxon";
import { type InferMutationResult } from "@trpc/react-query/src/utils/inferReactQueryProcedure";
import { type AppRouter } from "$/server/api/root";
import Image from "next/image";

type Props = {
  group: NonNullable<
    InferMutationResult<AppRouter["user"]["getOwnedGroups"]>["data"]
  >[number];
};

const GroupCard: FC<Props> & {
  Skeleton: FC;
} = ({ group }) => {
  return (
    <Link
      key={group.id}
      className="flex flex-col gap-2 rounded-lg bg-white p-6 shadow transition-colors duration-200 ease-in-out hover:bg-neutral-50 dark:bg-neutral-900/30 dark:text-neutral-100 dark:hover:bg-neutral-900/50"
      href={`/dashboard/${group.id}`}
    >
      <div className="flex items-center justify-between gap-4 text-lg font-bold text-indigo-500 dark:text-indigo-400">
        <span className="truncate">{group.name}</span>

        <div className="flex -space-x-2 overflow-hidden p-2">
          {group?.users?.map(({ user }) =>
            user.image == null ? (
              <div
                key={user.name}
                className="tranform inline-block w-7 rounded-full bg-neutral-200 text-center ring-2 ring-white duration-100 hover:scale-105 dark:bg-neutral-600 dark:ring-neutral-800 md:w-8"
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <Image
                key={user.image}
                className="tranform inline-block w-7 rounded-full duration-100 hover:scale-105 md:w-8"
                src={user.image}
                alt={user.name ?? "Miembro del grupo"}
                width={20}
                height={20}
              />
            )
          )}
        </div>
      </div>

      <span className="mt-2 mb-6 pr-2 lg:pr-3 xl:pr-6">
        {truncateString(group.description, 80)}
      </span>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm">
          <CalendarIcon className="h-4 w-4" />
          {DateTime.fromJSDate(group.createdAt).toLocaleString({
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <Button
          color="indigo"
          type="button"
          noPadding
          className="flex items-center gap-2 px-3 py-0.5"
        >
          Ver
          <EyeIcon className="h-5 w-5" />
        </Button>
      </div>
    </Link>
  );
};

const Skeleton: FC = () => (
  <div className="flex h-60 animate-pulse flex-col gap-2 rounded-lg bg-white p-6 shadow transition-transform duration-200 ease-in-out hover:scale-105 dark:bg-neutral-900/30 dark:text-neutral-100">
    <div className="flex items-center justify-between gap-4 text-lg font-bold text-indigo-500 dark:text-indigo-400">
      <div className="h-4 w-1/2 rounded bg-neutral-300 dark:bg-neutral-700" />
      <div className="h-4 w-1/4 rounded bg-neutral-300 dark:bg-neutral-700" />
    </div>

    <div className="mt-4 h-12 w-full rounded bg-neutral-300 dark:bg-neutral-700" />
  </div>
);

GroupCard.Skeleton = Skeleton;
export default GroupCard;
