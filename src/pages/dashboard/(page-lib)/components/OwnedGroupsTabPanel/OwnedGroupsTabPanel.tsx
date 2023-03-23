import React, { type FC, useState } from "react";
import Button from "$/components/Button";
import { PlusIcon } from "@heroicons/react/solid";
import CreateDebtTableModal from "$/pages/dashboard/(page-lib)/components/OwnedGroupsTabPanel/CreateDebtTableModal";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/TimeInMs";
import DebtTableCard from "$/pages/dashboard/(page-lib)/components/DebtTableCard";

type Props = {
  selected: boolean;
};

const OwnedGroupsTabPanel: FC<Props> = ({ selected }) => {
  const [showCreate, setShowCreate] = useState(false);

  const query = api.debtTables.getAllOwned.useQuery(undefined, {
    enabled: selected,
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return (
    <>
      <CreateDebtTableModal
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

          {!query.isFetching && query.data?.debtTables.length === 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-700 opacity-75 dark:bg-yellow-300" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-600 dark:bg-yellow-400" />
            </span>
          )}
        </div>

        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {query.data?.debtTables.length} / 10 tablas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {query.isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <DebtTableCard.Skeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {query.data?.debtTables.map((debtTable) => (
              <DebtTableCard key={debtTable.id} debtTable={debtTable} />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default OwnedGroupsTabPanel;
