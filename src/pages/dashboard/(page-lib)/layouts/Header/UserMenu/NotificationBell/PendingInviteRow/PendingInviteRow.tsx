import { type FC } from "react";
import { type InferQueryResult } from "@trpc/react-query/src/utils/inferReactQueryProcedure";
import { type AppRouter } from "$/server/api/root";
import cs from "$/utils/cs";
import truncateString from "$/utils/truncateString";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { Menu } from "@headlessui/react";
import { api } from "$/utils/api";

type Props = {
  invite: NonNullable<
    InferQueryResult<AppRouter["invites"]["getAll"]>["data"]
  >[number];
};

const PendingInviteRow: FC<Props> = ({ invite }) => {
  const utils = api.useContext();
  const acceptMutation = api.invites.acceptInvite.useMutation({
    onSuccess: async (res) => {
      const prevData = utils.invites.getAll.getData() ?? [];

      utils.invites.getAll.setData(undefined, [
        ...prevData.filter(
          (invite) => invite.debtTableId !== res.acceptedDebtTableId
        ),
      ]);

      await utils.debtTables.invalidate();

      return {
        prevData,
      };
    },
  });
  const rejectMutation = api.invites.rejectInvite.useMutation({
    onSuccess: (res) => {
      const prevData = utils.invites.getAll.getData() ?? [];

      utils.invites.getAll.setData(undefined, [
        ...prevData.filter(
          (invite) => invite.debtTableId !== res.rejectedDebtTableId
        ),
      ]);

      return {
        prevData,
      };
    },
    onError: (err) => {
      if (err.data?.code === "BAD_REQUEST") {
        const prevData = utils.invites.getAll.getData() ?? [];

        utils.invites.getAll.setData(undefined, [
          ...prevData.filter(
            (invite) => invite.debtTableId !== invite.debtTableId
          ),
        ]);

        return {
          prevData,
        };
      }
    },
  });

  return (
    <Menu.Item key={invite.name}>
      {({ active }) => (
        <div
          className={cs(
            active && "bg-gray-100 dark:bg-neutral-600",
            "flex w-full items-center justify-between gap-1 self-stretch px-4 py-2 text-sm"
          )}
        >
          <div className="flex flex-col font-medium">
            {invite.owner}
            <span className="font-normal dark:text-neutral-200">
              Grupo {truncateString(invite.name, 14)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-green-500 p-0.5 text-green-500 hover:bg-green-100 hover:dark:bg-green-900"
              onClick={() => {
                void toast.promise(
                  acceptMutation.mutateAsync({
                    debtTableId: invite.debtTableId,
                  }),
                  {
                    loading: "Aceptando invitación...",
                    success: "Invitación aceptada",
                    error: handleToastError,
                  }
                );
              }}
            >
              <CheckIcon className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="rounded-full border border-neutral-500 p-0.5 text-neutral-500 hover:bg-neutral-200 dark:border-neutral-400 dark:text-neutral-400 hover:dark:bg-neutral-700"
              onClick={() => {
                void toast.promise(
                  rejectMutation.mutateAsync({
                    debtTableId: invite.debtTableId,
                  }),
                  {
                    loading: "Rechazando invitación...",
                    success: "Invitación rechazada",
                    error: handleToastError,
                  }
                );
              }}
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </Menu.Item>
  );
};

export default PendingInviteRow;
