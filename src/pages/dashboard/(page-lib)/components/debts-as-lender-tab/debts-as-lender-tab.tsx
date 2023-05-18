import React, { type FC } from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import CreateDebtModal from "src/pages/dashboard/(page-lib)/components/debts-as-lender-tab/create-debt-modal";
import { Button } from "$/components/ui/button";
import { PlusIcon } from "@heroicons/react/solid";
import Debts from "src/pages/dashboard/(page-lib)/components/debts";
import { Dialog } from "$/components/ui/dialog";

const DebtsAsLenderTab: FC = () => {
  const [showCreateGroupModal, setShowCreateGroupModal] = React.useState(false);
  const query = api.user.getOwnedDebts.useQuery(undefined, {
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debtsAsLender ?? [];

  return (
    <Dialog>
      <CreateDebtModal
        show={showCreateGroupModal}
        onClose={setShowCreateGroupModal}
      />

      <div className="flex items-center justify-between">
        <div className="relative">
          <Button
            color="indigo"
            className="flex items-center gap-1"
            onClick={() => {
              setShowCreateGroupModal(true);
            }}
          >
            <PlusIcon className="h-5 w-5" />
            Crear <span className="hidden sm:inline-block">Nuevo</span> Grupo
          </Button>

          {!query.isFetching && debts.length === 0 && (
            <span className="absolute right-0 top-0 -mr-1 -mt-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-700 opacity-75 dark:bg-yellow-300" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-600 dark:bg-yellow-400" />
            </span>
          )}
        </div>

        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {debts.length} deuda{debts.length !== 1 && "s"}
        </span>
      </div>

      <Debts loading={query.isLoading} debts={debts} />
    </Dialog>
  );
};

export default DebtsAsLenderTab;
