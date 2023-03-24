import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import MembersSettings from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/MembersSettings";
import { api } from "$/utils/api";
import TimeInMs from "$/enums/TimeInMs";
import LoadingPage from "$/components/LoadingPage";
import { CogIcon } from "@heroicons/react/outline";
import GeneralSettings from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/GeneralSettings/GeneralSettings";
import DangerZone from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/DangerZone";
import Unauthorized from "$/components/Unauthorized";
import GoBackButton from "$/components/GoBackButton/GoBackButton";
import {
  type GetSettingsInput,
  getSettingsInput,
} from "$/server/api/routers/groups/queries/getSettingsHandler/input";
import AuthLayout from "$/layouts/AuthLayout/AuthLayout";
import Layout from "$/layouts/Layout";

const SettingsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const parsedGroupId = getSettingsInput.shape.groupId.safeParse(
    router.query.groupId
  );
  const groupId = parsedGroupId.success ? parsedGroupId.data : null;

  const queryVariables: GetSettingsInput = {
    groupId: groupId as string,
  };
  const query = api.groups.getSettings.useQuery(queryVariables, {
    enabled: groupId !== null,
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    retry: false,
    onError: (error) => error.data?.code !== "UNAUTHORIZED",
  });
  const groupSettings = query.data;

  if (groupId === null || query.error?.data?.code === "UNAUTHORIZED") {
    return <Unauthorized />;
  }

  if (query.isInitialLoading || groupSettings == null) {
    return <LoadingPage />;
  }

  return (
    <Layout className="flex flex-col gap-6">
      <GoBackButton />

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
          members={groupSettings.collaborators}
          pendingMembers={groupSettings.pendingInvites}
          queryVariables={queryVariables}
        />

        <DangerZone groupId={queryVariables.groupId} />
      </div>
    </Layout>
  );
};

SettingsPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default SettingsPage;
