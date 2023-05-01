import { type NextPageWithLayout } from "$/pages/_app.page";
import { Layout } from "$/components/layouts/layout";
import { Tab } from "@headlessui/react";
import cn from "$/utils/cn";
import { useRouter } from "next/router";
import { z } from "zod";
import { AuthLayout } from "$/components/layouts/auth-layout";
import OwnedGroupsTab from "src/pages/dashboard/(page-lib)/components/owned-groups-tab";
import SharedGroupsTab from "src/pages/dashboard/(page-lib)/components/shared-groups-tab";

const tabCategories = [
  {
    id: "yours",
    title: "Tus Grupos",
  },
  {
    id: "shared",
    title: "Grupos Compartidos",
  },
] as const;

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();

  const groupId = z
    .union([z.literal("yours"), z.literal("shared")])
    .catch("yours")
    .parse(router.query.group);
  const selectedTab = tabCategories.findIndex(
    (category) => category.id === groupId
  );

  function handleTabChange(index: number) {
    void router.push({
      pathname: "/dashboard",
      query: {
        group: tabCategories[index]?.id,
      },
    });
  }

  return (
    <Layout>
      <Tab.Group
        as="div"
        className="flex flex-col gap-6"
        onChange={handleTabChange}
        defaultIndex={selectedTab}
      >
        <Tab.List className="flex gap-2 self-center rounded bg-neutral-200 p-1 dark:bg-neutral-700 md:self-start">
          {tabCategories.map((category) => (
            <Tab
              key={category.id}
              className={({ selected }) =>
                cn(
                  "rounded p-3 text-sm font-bold leading-5 text-neutral-600 transition-colors duration-100 ease-in-out focus:outline-none",
                  selected
                    ? "bg-white text-black shadow dark:bg-neutral-800 dark:text-neutral-100"
                    : "hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-600"
                )
              }
            >
              {category.title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel as="div" className="flex flex-col gap-6">
            <OwnedGroupsTab />
          </Tab.Panel>

          <Tab.Panel as="div" className="flex flex-col gap-6">
            <SharedGroupsTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  );
};

Dashboard.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Dashboard;
