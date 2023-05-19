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
  const debts = query.data?.debtsAsBorrower ?? [];
  const normalizedDebts = debts.map((debt) => ({
    ...debt.debt,
  }));

  return (
    <>
      <Debts loading={query.isLoading} debts={normalizedDebts} />
    </>
  );
};

export default DebtsAsBorrowerTab;
