import React, { type FC } from "react";
import DebtCard from "src/pages/dashboard/(page-lib)/components/debts/debt-card";
import { type AppRouter } from "$/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";

type Props = {
  loading: boolean;
  debts: NonNullable<inferProcedureOutput<AppRouter["user"]["getOwnedDebts"]>>;
};

const Debts: FC<Props> = ({ loading, debts }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {loading ? (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <DebtCard.Skeleton key={index} />
          ))}
        </>
      ) : (
        <>
          {debts.map((debtTable) => (
            <DebtCard key={debtTable.id} debt={debtTable} />
          ))}
        </>
      )}
    </div>
  );
};

export default Debts;
