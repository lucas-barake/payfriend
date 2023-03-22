import { useSession } from "next-auth/react";
import Header from "$/layouts/Header";
import { type NextPageWithLayout } from "$/pages/_app.page";
import Button from "$/components/Button";
import { PlusIcon } from "@heroicons/react/solid";
import MainLayout from "$/layouts/MainLayout";
import { api } from "$/utils/api";
import CreateDebtTableModal from "$/pages/dashboard/(page-lib)/components/CreateDebtTableModal";
import { useState } from "react";
import DebtTable from "$/pages/dashboard/(page-lib)/components/DebtTable";
import TimeInMs from "$/enums/TimeInMs";
import AuthWrapper from "$/components/AuthWrapper";
import { Tab } from "@headlessui/react";
import cs from "$/utils/cs";

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
  const [showCreate, setShowCreate] = useState(false);

  const session = useSession();
  const query = api.debtTables.getAll.useQuery(undefined, {
    enabled:
      session.status === "authenticated" &&
      session.data.user.emailVerified != null,
    staleTime: TimeInMs.ThirtySeconds,
    refetchOnWindowFocus: true,
  });

  return (
    <MainLayout className="flex flex-col gap-6">
      <CreateDebtTableModal
        show={showCreate}
        onClose={() => {
          setShowCreate(false);
        }}
      />

      <Tab.Group as="div" className="self-center md:self-start">
        <Tab.List className="flex gap-2 rounded bg-neutral-200 p-1 dark:bg-neutral-700">
          {tabCateogories.map((category) => (
            <Tab
              key={category.id}
              className={({ selected }) =>
                cs(
                  "rounded p-3 text-sm font-bold leading-5 text-neutral-600 transition-colors duration-200 ease-in-out",
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
      </Tab.Group>

      <div className="flex items-center justify-between">
        <span className="relative inline-flex">
          <Button
            color="indigo"
            className="flex items-center gap-1"
            onClick={() => {
              setShowCreate(true);
            }}
          >
            <PlusIcon className="h-5 w-5" />
            Crear <span className="hidden sm:inline-block">Nuevo</span> Grupo
          </Button>

          {!query.isFetching && query.data?.debtTables.length === 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-700 opacity-75 dark:bg-yellow-300" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-600 dark:bg-yellow-400" />
            </span>
          )}
        </span>

        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {query.data?.debtTables.length} / 10 tablas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {query.isLoading ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex h-60 animate-pulse flex-col gap-2 rounded-lg bg-white p-6 shadow transition-transform duration-200 ease-in-out hover:scale-105 dark:bg-neutral-900/30 dark:text-neutral-100"
              >
                <div className="flex items-center justify-between gap-4 text-lg font-bold text-indigo-500 dark:text-indigo-400">
                  <div className="h-4 w-1/2 rounded bg-neutral-300 dark:bg-neutral-700" />
                  <div className="h-4 w-1/4 rounded bg-neutral-300 dark:bg-neutral-700" />
                </div>

                <div className="mt-4 h-12 w-full rounded bg-neutral-300 dark:bg-neutral-700" />
              </div>
            ))}
          </>
        ) : (
          <>
            {query.data?.debtTables.map((debtTable) => (
              <DebtTable key={debtTable.id} debtTable={debtTable} />
            ))}
          </>
        )}
      </div>
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
