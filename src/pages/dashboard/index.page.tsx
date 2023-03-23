import Header from "$/layouts/Header";
import { type NextPageWithLayout } from "$/pages/_app.page";
import MainLayout from "$/layouts/MainLayout";
import AuthWrapper from "$/components/AuthWrapper";
import { Tab } from "@headlessui/react";
import cs from "$/utils/cs";
import Groups from "$/pages/dashboard/(page-lib)/components/Groups";

const tabCateogories = [
  {
    id: "clfkb7bqm000008l504ty55y4",
    title: "Tus Grupos",
  },
  {
    id: "clfkb7i2z000108l55ln6briu",
    title: "Grupos Compartidos",
  },
];

const Dashboard: NextPageWithLayout = () => {
  return (
    <MainLayout>
      <Tab.Group as="div" className="flex flex-col gap-6">
        <Tab.List className="flex gap-2 self-center rounded bg-neutral-200 p-1 dark:bg-neutral-700 md:self-start">
          {tabCateogories.map((category) => (
            <Tab
              key={category.id}
              className={({ selected }) =>
                cs(
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
            {({ selected }) => <Groups selected={selected} render="owned" />}
          </Tab.Panel>

          <Tab.Panel as="div" className="flex flex-col gap-6">
            {({ selected }) => <Groups selected={selected} render="shared" />}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </MainLayout>
  );
};

Dashboard.getLayout = (page) => (
  <AuthWrapper>
    <Header />

    {page}
  </AuthWrapper>
);

export default Dashboard;
