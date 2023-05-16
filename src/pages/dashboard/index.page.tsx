import { type NextPageWithLayout } from "$/pages/_app.page";
import { Tab } from "@headlessui/react";
import cn from "$/lib/utils/cn";
import { useRouter } from "next/router";
import { z } from "zod";
import { AuthLayout } from "$/components/layouts/auth-layout";
import DebtsAsLenderTab from "src/pages/dashboard/(page-lib)/components/debts-as-lender-tab";
import DebtsAsBorrowerTab from "src/pages/dashboard/(page-lib)/components/debts-as-borrower-tab";
import { Layout } from "$/components/layouts/layout";

const tabCategories = [
  {
    id: "yours",
    title: "Tus Deudas",
  },
  {
    id: "shared",
    title: "Deudas como Prestamista",
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

  function handleTabChange(index: number): void {
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
            <DebtsAsLenderTab />
          </Tab.Panel>

          <Tab.Panel as="div" className="flex flex-col gap-6">
            <DebtsAsBorrowerTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  );
};

Dashboard.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Dashboard;
