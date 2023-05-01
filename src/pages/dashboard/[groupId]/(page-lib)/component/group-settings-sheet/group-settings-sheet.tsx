import { type FC } from "react";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/get-settings-by-id/input";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/time-in-ms";
import { Settings } from "lucide-react";
import MembersSettings from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings-sheet/members-settings";
import GeneralSettings from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings-sheet/general-settings";
import DangerZone from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings-sheet/danger-zone";
import { Sheet } from "$/components/ui/sheet";
import { Skeleton } from "$/components/ui/skeleton";
import { Button } from "$/components/ui/button";

type Props = {
  groupId: GetSettingsInput["groupId"];
};

const GroupSettingsSheet: FC<Props> = ({ groupId }) => {
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

  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button>
          <Settings className="mr-2 h-5 w-5" />
          Configuración
        </Button>
      </Sheet.Trigger>

      <Sheet.Content size="sm">
        <Sheet.Header>
          {groupSettings?.name === undefined ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <Sheet.Title className="flex items-center gap-2 self-start text-3xl font-bold">
              <Settings className="h-6 w-6" />
              {groupSettings?.name}
            </Sheet.Title>
          )}
        </Sheet.Header>

        <div className="mt-8 flex flex-col items-center justify-center gap-8">
          {groupSettings === undefined ? (
            <>
              <Skeleton className="h-72 w-full" />

              <Skeleton className="h-48 w-full" />

              <Skeleton className="h-28 w-full" />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </Sheet.Content>
    </Sheet>
  );
};

export default GroupSettingsSheet;
