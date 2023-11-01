import React from "react";
import { api } from "$/lib/utils/api";
import { useSessionStorage } from "$/hooks/browser-storage/use-session-storage";
import {
  getPersonalExpensesInput,
  PERSONAL_EXPENSES_PAGINATION_LIMIT,
} from "$/server/api/routers/personal-expenses/queries/input";
import { TimeInMs } from "$/lib/enums/time";
import SortMenu from "src/pages/dashboard/(page-lib)/components/expenses-tab/sort-menu";
import DebtsGrid from "$/pages/dashboard/(page-lib)/components/debts-grid";
import DebtCard from "$/pages/dashboard/(page-lib)/components/debt-card";
import ExpenseCard from "$/pages/dashboard/(page-lib)/components/expenses-tab/expense-card";
import PageControls from "$/pages/dashboard/(page-lib)/components/page-controls";
import AddEditExpenseDialog from "$/pages/dashboard/(page-lib)/components/expenses-tab/add-edit-expense-dialog/add-edit-expense-dialog";
import { Plus } from "lucide-react";
import { Button } from "$/components/ui/button";

const ExpensesTab: React.FC = () => {
  const [openAdd, setOpenAdd] = React.useState(false);
  const queryVariables = useSessionStorage({
    validationSchema: getPersonalExpensesInput,
    key: "expenses-tab-query-variables",
    defaultValues: {
      skip: 0,
      orderBy: {
        amount: null,
        createdAt: "desc",
      },
    },
  });

  const query = api.personalExpenses.get.useQuery(queryVariables.state, {
    staleTime: TimeInMs.OneMinute,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const expenses = query.data?.expenses ?? [];

  return (
    <React.Fragment>
      <AddEditExpenseDialog open={openAdd} setOpen={setOpenAdd} />

      <div className="flex items-center justify-between">
        <Button
          onClick={() => {
            setOpenAdd(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline-flex">Agregar</span>
          Gasto
        </Button>

        <div className="flex items-center gap-2">
          <SortMenu {...queryVariables} />
        </div>
      </div>

      <DebtsGrid>
        {query.isLoading ? (
          <React.Fragment>
            {Array.from({ length: 8 }).map((_, index) => (
              <DebtCard.Skeleton key={index} />
            ))}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {expenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </React.Fragment>
        )}
      </DebtsGrid>

      <PageControls
        page={queryVariables.state.skip / PERSONAL_EXPENSES_PAGINATION_LIMIT}
        setPage={(page) => {
          queryVariables.setState((prevState) => ({
            ...prevState,
            skip: page * PERSONAL_EXPENSES_PAGINATION_LIMIT,
          }));
        }}
        count={query.data?.totalCount ?? 0}
      />
    </React.Fragment>
  );
};

export default ExpensesTab;
