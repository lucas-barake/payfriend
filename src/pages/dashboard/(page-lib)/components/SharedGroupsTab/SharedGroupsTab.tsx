import React, { type FC } from "react";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/TimeInMs";
import Groups from "$/pages/dashboard/(page-lib)/components/Groups";

const SharedGroupsTab: FC = () => {
  const query = api.user.getSharedGroups.useQuery(undefined, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const groups = query.data ?? [];

  return (
    <>
      <span className="text-end text-sm text-neutral-700 dark:text-neutral-300">
        {groups.length} / 10 grupos
      </span>

      <Groups loading={query.isLoading} groups={groups} />
    </>
  );
};

export default SharedGroupsTab;
