import React from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";
import PageControls from "$/pages/dashboard/(page-lib)/components/page-controls";
import { type inferProcedureInput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";

const DebtsAsBorrowerTab: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const queryVariables = {
    limit: 10,
    skip: page * 10,
  } satisfies inferProcedureInput<AppRouter["debts"]["getSharedDebts"]>;
  const query = api.debts.getSharedDebts.useQuery(queryVariables, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debtsAsBorrower ?? [];
  const normalizedDebts = debts.map((debt) => ({
    ...debt.debt,
  }));

  if (query.isSuccess && normalizedDebts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-lg text-muted-foreground">
          ¡Estás libre de deudas! Nadie te ha prestado dinero.
        </p>
      </div>
    );
  }

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
            {normalizedDebts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                queryVariables={queryVariables}
              />
            ))}
          </>
        )}
      </DebtsGrid>

      <PageControls
        page={page}
        setPage={setPage}
        count={query.data?._count.debtsAsBorrower ?? 0}
      />
    </>
  );
};

export default DebtsAsBorrowerTab;
