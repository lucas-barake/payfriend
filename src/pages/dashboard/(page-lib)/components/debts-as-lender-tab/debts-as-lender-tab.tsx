import React from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";
import PageControls from "$/pages/dashboard/(page-lib)/components/page-controls";
import AddDebtDialog from "$/pages/dashboard/(page-lib)/components/add-debt-dialog";
import FiltersMenu from "src/pages/dashboard/(page-lib)/components/filters-menu";
import SortMenu from "$/pages/dashboard/(page-lib)/components/sort-menu";
import { type LenderDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/input";

const DebtsAsLenderTab: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState<LenderDebtsQueryInput["sort"]>("desc");
  const [status, setStatus] =
    React.useState<LenderDebtsQueryInput["status"]>("active");
  const queryVariables = {
    skip: page * 10,
    sort,
    status,
  } satisfies LenderDebtsQueryInput;
  const query = api.debts.getOwnedDebts.useQuery(queryVariables, {
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debts ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <AddDebtDialog queryVariables={queryVariables} />

        <div className="flex items-center gap-2">
          <SortMenu sort={sort} setSort={setSort} />

          <FiltersMenu status={status} setStatus={setStatus} lender />
        </div>
      </div>

      {query.isSuccess && debts.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-lg text-muted-foreground">
            No hay nada aquí...
          </p>
        </div>
      )}

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
