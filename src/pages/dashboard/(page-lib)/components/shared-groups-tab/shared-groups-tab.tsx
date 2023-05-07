import React, { type FC } from "react";
import { api } from "$/lib/utils/api";
import TimeInMs from "$/lib/enums/time-in-ms";
import Groups from "src/pages/dashboard/(page-lib)/components/groups";

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
