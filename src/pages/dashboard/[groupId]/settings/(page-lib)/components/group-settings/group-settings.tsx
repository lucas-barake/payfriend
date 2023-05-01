import { type FC } from "react";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/get-settings-by-id/input";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/time-in-ms";
import { UnauthorizedView } from "src/components/pages/unauthorized-view";
import LoadingPage from "src/components/pages/loading-page";
import GeneralSettings from "src/pages/dashboard/[groupId]/settings/(page-lib)/components/group-settings/general-settings";
import MembersSettings from "src/pages/dashboard/[groupId]/(page-lib)/component/group-settings/members-settings";
import DangerZone from "src/pages/dashboard/[groupId]/settings/(page-lib)/components/group-settings/danger-zone";
import { Settings } from "lucide-react";

type Props = {
  groupId: GetSettingsInput["groupId"];
};

const GroupSettings: FC<Props> = ({ groupId }) => {
  const queryVariables: GetSettingsInput = {
    groupId,
  };
  const query = api.groups.getSettingsById.useQuery(queryVariables, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    retry: false,
    onError: (error) => error.data?.code !== "UNAUTHORIZED",
  });
  const groupSettings = query.data;

  if (query.error?.data?.code === "UNAUTHORIZED") {
    return <UnauthorizedView />;
  }

  if (query.isInitialLoading || groupSettings === undefined) {
    return <LoadingPage />;
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-8">
      <h1 className="flex items-center gap-2 self-start text-3xl font-bold">
        <Settings className="h-6 w-6" />
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
