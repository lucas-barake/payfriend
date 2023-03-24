import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import Layout from "$/layouts/Layout";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import {
  type GetGroupByIdInput,
  getGroupByIdInput,
} from "$/server/api/routers/groups/queries/getById/input";
import LoadingSpinnerIcon from "$/components/Icons/LoadingSpinnerIcon";
import TimeInMs from "$/enums/TimeInMs";
import { CogIcon } from "@heroicons/react/outline";
import Link from "next/link";
import GoBackButton from "$/components/GoBackButton/GoBackButton";
import AuthLayout from "$/layouts/AuthLayout/AuthLayout";

const GroupDashboardPage: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();
  const parsedGroupId = getGroupByIdInput.shape.id.safeParse(
    router.query.groupId
  );
  const groupId = parsedGroupId.success ? parsedGroupId.data : null;

  const queryVariables: GetGroupByIdInput = {
    id: groupId as string,
  };
  const query = api.groups.getById.useQuery(queryVariables, {
    enabled: session.status === "authenticated" && groupId !== null,
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    onError: (error) => error.data?.code !== "UNAUTHORIZED",
  });
  const isOwner =
    query.data?.collaborators.find(
      (collaborator) => collaborator.collaboratorId === session.data?.user.id
    )?.role === "OWNER";

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <GoBackButton />

        {groupId !== null && isOwner && (
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

GroupDashboardPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default GroupDashboardPage;
