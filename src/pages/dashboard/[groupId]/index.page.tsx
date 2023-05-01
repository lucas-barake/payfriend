import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import {
  type GetGroupByIdInput,
  getGroupByIdInput,
} from "$/server/api/routers/groups/groups/get-group-by-id/input";
import LoadingSpinner from "src/components/ui/icons/loading-spinner";
import TimeInMs from "$/enums/time-in-ms";
import Link from "next/link";
import { GoBackButton } from "$/components/ui/go-back-button";
import { AuthLayout } from "$/components/layouts/auth-layout";
import { UnauthorizedView } from "src/components/pages/unauthorized-view";
import { Layout } from "$/components/layouts/layout";
import { type ReactElement } from "react";
import { buttonVariants } from "$/components/ui/button";
import { Settings } from "lucide-react";

const GroupDashboardPage: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();
  const groupId = router.query.groupId as string;

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

        {isOwner && (
          <Link
            className={buttonVariants()}
            href={`/dashboard/${groupId}/settings`}
          >
            <Settings className="mr-2 h-6 w-6" />
            Configuración
          </Link>
        )}
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

const QueryWrapper = (page: ReactElement) => {
  const router = useRouter();
  const parsedGroupId = getGroupByIdInput.shape.id.safeParse(
    router.query.groupId
  );
  const groupId = parsedGroupId.success ? parsedGroupId.data : null;

  return (
    <AuthLayout>{groupId === null ? <UnauthorizedView /> : page}</AuthLayout>
  );
};

GroupDashboardPage.getLayout = QueryWrapper;

export default GroupDashboardPage;
