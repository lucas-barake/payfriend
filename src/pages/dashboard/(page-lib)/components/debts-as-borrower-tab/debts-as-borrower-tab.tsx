import React, { type FC } from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import Debts from "src/pages/dashboard/(page-lib)/components/debts";

const DebtsAsBorrowerTab: FC = () => {
  const query = api.user.getSharedDebts.useQuery(undefined, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data ?? [];

  return (
    <>
      <span className="text-end text-sm text-neutral-700 dark:text-neutral-300">
        {debts.length}
      </span>

      <Debts loading={query.isLoading} debts={debts} />
    </>
  );
};

export default DebtsAsBorrowerTab;
