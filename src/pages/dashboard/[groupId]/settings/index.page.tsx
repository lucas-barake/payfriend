import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import { UnauthorizedView } from "src/components/unauthorized-view";
import GoBackButton from "$/components/ui/go-back-button/go-back-button";
import { getSettingsInput } from "$/server/api/routers/groups/groups/get-settings-by-id/input";
import { AuthLayout } from "$/layouts/auth-layout";
import { Layout } from "src/layouts/layout";
import GroupSettings from "src/pages/dashboard/[groupId]/settings/(page-lib)/components/group-settings";

const SettingsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const parsedGroupId = getSettingsInput.shape.groupId.safeParse(
    router.query.groupId
  );
  const groupId = parsedGroupId.success ? parsedGroupId.data : null;

  if (groupId === null) {
    return <UnauthorizedView />;
  }

  return (
    <Layout className="flex flex-col gap-6">
      <GoBackButton />

      <GroupSettings groupId={groupId} />
    </Layout>
  );
};

SettingsPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default SettingsPage;
