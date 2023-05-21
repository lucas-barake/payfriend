import React, { type FC } from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";

const DebtsAsLenderTab: FC = () => {
  const query = api.user.getOwnedDebts.useQuery(undefined, {
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debtsAsLender ?? [];

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
          {debts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} lender />
          ))}
        </>
      )}
    </DebtsGrid>
  );
};

export default DebtsAsLenderTab;
