import React, { type FC, useState } from "react";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/time-in-ms";
import CreateGroupModal from "src/pages/dashboard/(page-lib)/components/owned-groups-tab/create-group-modal";
import Button from "src/components/ui/button";
import { PlusIcon } from "@heroicons/react/solid";
import Groups from "src/pages/dashboard/(page-lib)/components/groups";

const OwnedGroupsTab: FC = () => {
  const [showCreate, setShowCreate] = useState(false);

  const query = api.user.getOwnedGroups.useQuery(undefined, {
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const groups = query.data ?? [];

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

          {!query.isFetching && query.data?.length === 0 && (
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

      <Groups loading={query.isLoading} groups={groups} />
    </>
  );
};

export default OwnedGroupsTab;
