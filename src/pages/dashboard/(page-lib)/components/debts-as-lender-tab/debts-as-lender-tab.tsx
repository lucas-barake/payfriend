import React, { type FC } from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import Debts from "src/pages/dashboard/(page-lib)/components/debts";

const DebtsAsLenderTab: FC = () => {
  const query = api.user.getOwnedDebts.useQuery(undefined, {
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debtsAsLender ?? [];

  return (
    <>
      <Debts loading={query.isLoading} debts={debts} />
    </>
  );
};

export default DebtsAsLenderTab;
