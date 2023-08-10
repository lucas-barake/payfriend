import React from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debt-card";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";
import PageControls from "$/pages/dashboard/(page-lib)/components/page-controls";
import SortMenu from "$/pages/dashboard/(page-lib)/components/sort-menu";
import FiltersMenu from "$/pages/dashboard/(page-lib)/components/filters-menu";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/get-debts/debts-as-borrower/input";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/get-debts/(lib)/constants";
import DebtAsBorrowerCard from "$/pages/dashboard/(page-lib)/components/debts-as-borrower-tab/debt-as-borrower-card";

const DebtsAsBorrowerTab: React.FC = () => {
  const [queryVariables, setQueryVariables] =
    React.useState<DebtsAsBorrowerInput>({
      skip: 0,
      sort: "desc",
      status: "active",
    });

  const query = api.debts.getSharedDebts.useQuery(queryVariables, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const debts = query.data?.debts ?? [];

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <SortMenu
          selectedSort={queryVariables.sort}
          setSelectedSort={(sort) => {
            setQueryVariables({ ...queryVariables, sort, skip: 0 });
          }}
        />

        <FiltersMenu
          selectedStatus={queryVariables.status}
          setSelectedStatus={(status) => {
            setQueryVariables({
              ...queryVariables,
              status,
              skip: 0,
            });
          }}
          lender={false}
        />
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
                <DebtAsBorrowerCard
                  key={debt.id}
                  debt={debt}
                  queryVariables={queryVariables}
                />
              ))}
            </>
          )
        )}
      </DebtsGrid>

      <PageControls
        page={queryVariables.skip / DEBTS_QUERY_PAGINATION_LIMIT}
        setPage={(page) => {
          setQueryVariables({
            ...queryVariables,
            skip: page * DEBTS_QUERY_PAGINATION_LIMIT,
          });
        }}
        count={query.data?.count ?? 0}
      />
    </>
  );
};

export default DebtsAsBorrowerTab;
