import React from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";
import PageControls from "$/pages/dashboard/(page-lib)/components/page-controls";
import SortMenu from "$/pages/dashboard/(page-lib)/components/sort-menu";
import FiltersMenu from "$/pages/dashboard/(page-lib)/components/filters-menu";
import { type BorrowerDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-shared-debts/input";

const DebtsAsBorrowerTab: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [sort, setSort] =
    React.useState<BorrowerDebtsQueryInput["sort"]>("desc");
  const [status, setStatus] =
    React.useState<BorrowerDebtsQueryInput["status"]>("active");

  const queryVariables = {
    skip: page * 10,
    sort,
    status,
  } satisfies BorrowerDebtsQueryInput;
  const query = api.debts.getSharedDebts.useQuery(queryVariables, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debts ?? [];

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <SortMenu sort={sort} setSort={setSort} />

        <FiltersMenu status={status} setStatus={setStatus} lender={false} />
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
          query.isSuccess && (
            <>
              {debts.map((debt) => (
                <DebtCard
                  key={debt.id}
                  debt={debt}
                  queryVariables={queryVariables}
                  lender={false}
                />
              ))}
            </>
          )
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

export default DebtsAsBorrowerTab;
