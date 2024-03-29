import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import DebtsAsBorrowerTab from "src/pages/dashboard/(page-lib)/components/debts-as-borrower-tab";
import { MainLayout } from "src/components/layouts/main-layout";
import { Tabs } from "$/components/ui/tabs";
import { type TabList, useTabs } from "$/hooks/use-tabs/use-tabs";
import { createManyUnion } from "$/lib/utils/zod/create-union-schema";
import DebtsAsLenderTab from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab";
import { cn } from "$/lib/utils/cn";

const tabs = ["yours", "shared"] as const satisfies TabList;
const tabIdsSchema = createManyUnion(
  tabs as typeof tabs & [string, string, ...string[]]
);

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();

  const queryTab = tabIdsSchema.catch(tabs[0]).parse(router.query.group);
  const initialTab = tabs.find((tab) => tab === queryTab) ?? tabs[0];

  const [selectedTab, tabSetters] = useTabs(tabs, {
    initialTab,
  });

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(id) => {
        const tab = tabs.find((tab) => tab === id) ?? tabs[0];
        tabSetters.set(tab);
        void router.push({
          pathname: "/dashboard",
          query: {
            group: id,
          },
        });
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-b-border/50 pb-2">
        <div className="flex items-center gap-4">
          <Tabs.List>
            <Tabs.Trigger value={tabs[0]}>Prestador</Tabs.Trigger>
            <Tabs.Trigger value={tabs[1]}>Deudor</Tabs.Trigger>
          </Tabs.List>
        </div>
      </div>

      <Tabs.Content
        value={tabs[0]}
        className={cn("flex flex-col justify-between gap-4", {
          hidden: selectedTab !== tabs[0],
        })}
      >
        <DebtsAsLenderTab />
      </Tabs.Content>

      <Tabs.Content
        value={tabs[1]}
        className={cn("flex flex-col justify-between gap-4", {
          hidden: selectedTab !== tabs[1],
        })}
      >
        <DebtsAsBorrowerTab />
      </Tabs.Content>
    </Tabs>
  );
};

Dashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Dashboard;
