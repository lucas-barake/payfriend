import { type FC } from "react";
import { type GetSettingsInput } from "$/server/api/routers/groups/queries/getSettingsById/input";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/TimeInMs";
import Unauthorized from "$/components/Unauthorized";
import LoadingPage from "$/components/LoadingPage";
import { CogIcon } from "@heroicons/react/outline";
import GeneralSettings from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/GroupSettings/GeneralSettings";
import MembersSettings from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/GroupSettings/MembersSettings";
import DangerZone from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/GroupSettings/DangerZone";

type Props = {
  groupId: GetSettingsInput["groupId"];
};

const GroupSettings: FC<Props> = ({ groupId }) => {
  const queryVariables: GetSettingsInput = {
    groupId: groupId,
  };
  const query = api.groups.getSettingsById.useQuery(queryVariables, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    retry: false,
    onError: (error) => error.data?.code !== "UNAUTHORIZED",
  });
  const groupSettings = query.data;

  if (query.error?.data?.code === "UNAUTHORIZED") {
    return <Unauthorized />;
  }

  if (query.isInitialLoading || groupSettings == null) {
    return <LoadingPage />;
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-8">
      <h1 className="flex items-center gap-2 self-start text-3xl font-bold">
        <CogIcon className="h-6 w-6" />
        {groupSettings.name}
      </h1>

      <GeneralSettings
        groupName={groupSettings.name}
        groupDescription={groupSettings.description}
        queryVariables={queryVariables}
      />

      <MembersSettings
        members={groupSettings.members}
        queryVariables={queryVariables}
      />

      <DangerZone queryVariables={queryVariables} />
    </div>
  );
};

export default GroupSettings;
