import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import Unauthorized from "$/components/Unauthorized";
import GoBackButton from "$/components/GoBackButton/GoBackButton";
import { getSettingsInput } from "$/server/api/routers/groups/queries/getSettingsById/input";
import AuthLayout from "$/layouts/AuthLayout/AuthLayout";
import Layout from "$/layouts/Layout";
import GroupSettings from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/GroupSettings";

const SettingsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const parsedGroupId = getSettingsInput.shape.groupId.safeParse(
    router.query.groupId
  );
  const groupId = parsedGroupId.success ? parsedGroupId.data : null;

  if (groupId === null) {
    return <Unauthorized />;
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
