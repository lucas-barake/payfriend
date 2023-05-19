import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import DebtsAsLenderTab from "src/pages/dashboard/(page-lib)/components/debts-as-lender-tab";
import DebtsAsBorrowerTab from "src/pages/dashboard/(page-lib)/components/debts-as-borrower-tab";
import { MainLayout } from "src/components/layouts/main-layout";
import { Tabs } from "$/components/ui/tabs";
import { type TabList, useTabs } from "$/hooks/use-tabs/use-tabs";
import { createManyUnion } from "$/lib/utils/zod/create-union-schema";

const tabs = [
  {
    id: "yours",
    label: "Deudas como Prestador",
  },
  {
    id: "shared",
    label: "Deudas como Deudor",
  },
] as const satisfies TabList;
const tabIds = tabs.map((tab) => tab.id);
const tabIdsSchema = createManyUnion(
  tabIds as typeof tabIds & [string, string, ...string[]]
);

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();

  const queryTab = tabIdsSchema.catch(tabs[0].id).parse(router.query.group);
  const initialTab = tabs.find((tab) => tab.id === queryTab) ?? tabs[0];

  const [selectedTab, tabSetters] = useTabs(tabs, {
    initialTab,
  });

  return (
    <Tabs
      value={selectedTab.id}
      onValueChange={(id) => {
        const tab = tabs.find((tab) => tab.id === id) ?? tabs[0];
        tabSetters.set(tab);
        void router.push({
          pathname: "/dashboard",
          query: {
            group: id,
          },
        });
      }}
    >
      <Tabs.List className="mb-4">
        {tabs.map((category) => (
          <Tabs.Trigger value={category.id} key={category.id}>
            {category.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value={tabs[0].id}>
        <DebtsAsLenderTab />
      </Tabs.Content>

      <Tabs.Content value={tabs[1].id}>
        <DebtsAsBorrowerTab />
      </Tabs.Content>
    </Tabs>
  );
};

Dashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Dashboard;
