import React, { type FC } from "react";
import GroupCard from "$/pages/dashboard/(page-lib)/components/groups/group-card";
import { type AppRouter } from "$/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";

type Props = {
  loading: boolean;
  groups: inferProcedureOutput<AppRouter["user"]["getOwnedGroups"]>;
};

const Groups: FC<Props> = ({ loading, groups }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {loading ? (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <GroupCard.Skeleton key={index} />
          ))}
        </>
      ) : (
        <>
          {groups.map((debtTable) => (
            <GroupCard key={debtTable.id} group={debtTable} />
          ))}
        </>
      )}
    </div>
  );
};

export default Groups;
