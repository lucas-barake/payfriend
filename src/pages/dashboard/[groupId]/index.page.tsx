import { type NextPageWithLayout } from "$/pages/_app.page";
import { api } from "$/lib/utils/api";
import { useSession } from "next-auth/react";
import {
  type GetGroupByIdInput,
  getGroupByIdInput,
} from "$/server/api/routers/groups/groups/queries/input";
import LoadingSpinner from "src/components/ui/icons/loading-spinner";
import { TimeInMs } from "$/lib/enums/time";
import { GoBackButton } from "$/components/ui/go-back-button";
import { AuthLayout } from "$/components/layouts/auth-layout";
import { UnauthorizedView } from "src/components/pages/unauthorized-view";
import GroupSettingsSheet from "src/pages/dashboard/[groupId]/(page-lib)/component/group-settings-sheet";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { Layout } from "$/components/layouts/layout";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { groupId } = context.query;

  const parsedGroupId = getGroupByIdInput.shape.id.safeParse(groupId);

  if (!parsedGroupId.success) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      groupId: parsedGroupId.data,
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;
const GroupDashboardPage: NextPageWithLayout<Props> = ({ groupId }) => {
  const session = useSession();

  const queryVariables: GetGroupByIdInput = {
    id: groupId,
  };
  const query = api.groups.getGroupById.useQuery(queryVariables, {
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
  });
  const isOwner =
    query.data?.users.find((user) => user.userId === session.data?.user.id)
      ?.role === "OWNER";

  if (query.isError) {
    return <UnauthorizedView />;
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <GoBackButton />

        {isOwner && <GroupSettingsSheet groupId={queryVariables.id} />}
      </div>

      {query.isLoading ? (
        <div className="flex h-full flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <p>{query.data?.name}</p>
      )}
    </Layout>
  );
};

GroupDashboardPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default GroupDashboardPage;
