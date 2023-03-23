import { type NextPageWithLayout } from "$/pages/_app.page";
import Header from "$/layouts/Header";
import { useRouter } from "next/router";
import MainLayout from "$/layouts/MainLayout";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";
import { getGroupByIdInput } from "$/server/api/routers/groups/queries/getById/input";
import LoadingSpinnerIcon from "$/components/Icons/LoadingSpinnerIcon";
import TimeInMs from "$/enums/TimeInMs";
import AuthWrapper from "$/components/AuthWrapper";

const GroupDashboardPage: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();
  const result = getGroupByIdInput.safeParse(router.query.groupId);
  const groupId = result.success ? result.data : null;

  const query = api.groups.getById.useQuery(groupId as string, {
    enabled: session.status === "authenticated" && groupId !== null,
    staleTime: TimeInMs.FifteenSeconds,
    refetchOnWindowFocus: true,
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        void router.push("/404");
      }
    },
    retry: false,
  });

  return (
    <MainLayout>
      {query.isLoading ? (
        <div className="flex h-full flex-col items-center justify-center">
          <LoadingSpinnerIcon />
        </div>
      ) : (
        <p>{query.data?.name}</p>
      )}

      <button
        type="button"
        onClick={() => {
          void router.push("/dashboard");
        }}
      >
        <ArrowLeftIcon
          className="h-6 w-6"
          onClick={() => {
            void router.push("/dashboard");
          }}
        />
      </button>
    </MainLayout>
  );
};

GroupDashboardPage.getLayout = (page) => (
  <AuthWrapper>
    <Header />

    {page}
  </AuthWrapper>
);

export default GroupDashboardPage;
