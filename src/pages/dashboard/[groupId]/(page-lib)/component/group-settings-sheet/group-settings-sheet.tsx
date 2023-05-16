import { type FC, useState } from "react";
import { type GetSettingsInput } from "$/server/api/routers/debts/debts/queries/input";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Settings } from "lucide-react";
import MembersSettings from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings-sheet/members-settings";
import GeneralSettings from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings-sheet/general-settings";
import DangerZone from "$/pages/dashboard/[groupId]/(page-lib)/component/group-settings-sheet/danger-zone";
import { Skeleton } from "$/components/ui/skeleton";
import { Button } from "$/components/ui/button";
import { Sheet } from "src/components/ui/sheet";

type Props = {
  groupId: GetSettingsInput["groupId"];
};

const GroupSettingsSheet: FC<Props> = ({ groupId }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Settings className="mr-2 h-5 w-5" />
        Configuración
      </Button>

      <Sheet
        open={isOpen}
        setOpen={() => {
          setIsOpen(false);
        }}
      >
        <Sheet.Title className="flex items-center gap-0.5">
          <Settings className="mr-2 h-5 w-5" />
          Configuración
        </Sheet.Title>

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
      </Sheet>
    </>
  );
};

export default GroupSettingsSheet;
