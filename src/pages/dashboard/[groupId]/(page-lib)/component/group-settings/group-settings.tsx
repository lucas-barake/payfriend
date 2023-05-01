import { type FC } from "react";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/get-settings-by-id/input";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/time-in-ms";
import { Settings } from "lucide-react";
import MembersSettings from "src/pages/dashboard/[groupId]/(page-lib)/component/group-settings/members-settings";
import GeneralSettings from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings/general-settings";
import DangerZone from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings/danger-zone";

type Props = {
  groupId: GetSettingsInput["groupId"];
};

const GroupSettings: FC<Props> = ({ groupId }) => {
  const queryVariables = {
    groupId,
  } satisfies GetSettingsInput;
  const query = api.groups.getSettingsById.useQuery(queryVariables, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    retry: false,
    onError: (error) => error.data?.code !== "UNAUTHORIZED",
  });
  const groupSettings = query.data;

  if (groupSettings === undefined) return null;

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
