import React from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";
import { type inferProcedureInput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";
import PageControls from "$/pages/dashboard/(page-lib)/components/page-controls";

const DebtsAsLenderTab: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const queryVariables = {
    limit: 10,
    skip: page * 10,
  } satisfies inferProcedureInput<AppRouter["debts"]["getOwnedDebts"]>;
  const query = api.debts.getOwnedDebts.useQuery(queryVariables, {
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debtsAsLender ?? [];

  return (
    <>
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
              <DebtCard
                key={debt.id}
                debt={debt}
                lender
                queryVariables={queryVariables}
              />
            ))}
          </>
        )}
      </DebtsGrid>

      <PageControls
        page={page}
        setPage={setPage}
        count={query.data?.count ?? 0}
      />
    </>
  );
};

export default DebtsAsLenderTab;
