import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import {
  type GetGroupByIdInput,
  getGroupByIdInput,
} from "$/server/api/routers/groups/groups/getGroupById/input";
import LoadingSpinnerIcon from "$/components/Icons/LoadingSpinnerIcon";
import TimeInMs from "$/enums/TimeInMs";
import { CogIcon } from "@heroicons/react/outline";
import Link from "next/link";
import GoBackButton from "$/components/GoBackButton/GoBackButton";
import AuthLayout from "$/layouts/AuthLayout/AuthLayout";
import Unauthorized from "$/components/Unauthorized";
import Layout from "$/layouts/Layout";
import { type ReactElement } from "react";

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
    return <Unauthorized />;
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <GoBackButton />

        {isOwner && (
          <Link
            className="flex transform items-center gap-2 rounded bg-indigo-600 px-4 py-1.5 font-medium text-white transition duration-200 ease-in-out hover:bg-indigo-700 active:translate-y-0.5"
            href={`/dashboard/${groupId}/settings`}
          >
            <CogIcon className="h-6 w-6" />
            Configuración
          </Link>
        )}
      </div>

      {query.isLoading ? (
        <div className="flex h-full flex-col items-center justify-center">
          <LoadingSpinnerIcon />
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

  return <AuthLayout>{groupId === null ? <Unauthorized /> : page}</AuthLayout>;
};

GroupDashboardPage.getLayout = QueryWrapper;

export default GroupDashboardPage;
