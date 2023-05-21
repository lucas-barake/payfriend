import React, { type FC } from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";

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
    <DebtsGrid>
      {query.isLoading ? (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <DebtCard.Skeleton key={index} />
          ))}
        </>
      ) : (
        <>
          {normalizedDebts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} />
          ))}
        </>
      )}
    </DebtsGrid>
  );
};

export default DebtsAsBorrowerTab;
