import { type FC, useState } from "react";
import Link from "next/link";
import CollaboratorsModal from "$/pages/dashboard/(page-lib)/components/CollaboratorsModal";
import Button from "$/components/Button";
import {
  CalendarIcon,
  EyeIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import truncateString from "$/utils/truncateString";
import { DateTime } from "luxon";
import { type InferMutationResult } from "@trpc/react-query/src/utils/inferReactQueryProcedure";
import { type AppRouter } from "$/server/api/root";

type Props = {
  debtTable: NonNullable<
    InferMutationResult<AppRouter["debtTables"]["getAll"]>["data"]
  >["debtTables"][0];
};

const DebtTable: FC<Props> = ({ debtTable }) => {
  const [showCollaborators, setShowCollaborators] = useState(false);

  return (
    <>
      <CollaboratorsModal
        show={showCollaborators}
        onClose={() => {
          setShowCollaborators(false);
        }}
        debtTableId={debtTable.id}
      />

      <Link
        key={debtTable.id}
        className="flex flex-col gap-2 rounded-lg bg-white p-6 shadow transition-colors duration-200 ease-in-out hover:bg-neutral-50 dark:bg-neutral-900/30 dark:text-neutral-100 dark:hover:bg-neutral-900/50"
        href={`/dashboard/${debtTable.id}`}
      >
        <div className="flex items-center justify-between gap-4 text-lg font-bold text-indigo-500 dark:text-indigo-400">
          <span className="truncate">{debtTable.name}</span>

          <span className="flex items-center gap-1">
            <UserCircleIcon className="h-5 w-5" />
            {debtTable.collaborators.length}
          </span>
        </div>

        <span className="mt-2 mb-6 pr-2 lg:pr-3 xl:pr-6">
          {truncateString(debtTable.description, 80)}
        </span>

        <div className="mt-auto flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm">
            <CalendarIcon className="h-4 w-4" />
            {DateTime.fromJSDate(debtTable.createdAt).toLocaleString({
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          <Button
            color="indigo"
            type="button"
            noPadding
            className="flex items-center gap-2 px-3 py-0.5"
          >
            Ver
            <EyeIcon className="h-5 w-5" />
          </Button>
        </div>
      </Link>
    </>
  );
};

export default DebtTable;
