import React, { type FC, useState } from "react";
import Button from "$/components/Button";
import { PlusIcon } from "@heroicons/react/solid";
import CreateGroupModal from "$/pages/dashboard/(page-lib)/components/Groups/CreateGroupModal";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/TimeInMs";
import GroupCard from "$/pages/dashboard/(page-lib)/components/Groups/GroupCard";

type Props = {
  selected: boolean;
  render: "owned" | "shared";
};

const OwnedGroupsTabPanel: FC<Props> = ({ selected, render }) => {
  const [showCreate, setShowCreate] = useState(false);

  const ownedQuery = api.groups.getAllOwned.useQuery(undefined, {
    enabled: selected && render === "owned",
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const sharedQuery = api.groups.getAllShared.useQuery(undefined, {
    enabled: selected && render === "shared",
    staleTime: TimeInMs.TenSeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const groups =
    (render === "owned" ? ownedQuery.data : sharedQuery.data) ?? [];

  return (
    <>
      <CreateGroupModal
        show={showCreate}
        onClose={() => {
          setShowCreate(false);
        }}
      />

      <div className="flex items-center justify-between">
        <div className="relative">
          <Button
            color="indigo"
            className="flex items-center gap-1"
            onClick={() => {
              setShowCreate(true);
            }}
          >
            <PlusIcon className="h-5 w-5" />
            Crear <span className="hidden sm:inline-block">Nuevo</span> Grupo
          </Button>

          {!ownedQuery.isFetching && ownedQuery.data?.length === 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-700 opacity-75 dark:bg-yellow-300" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-600 dark:bg-yellow-400" />
            </span>
          )}
        </div>

        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {groups.length} / 10 grupos
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {(render === "owned" && ownedQuery.isLoading) ||
        (render === "shared" && sharedQuery.isLoading) ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <GroupCard.Skeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {groups.map((debtTable) => (
              <GroupCard key={debtTable.id} debtTable={debtTable} />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default OwnedGroupsTabPanel;
