import { type FC } from "react";
import { type AppRouter } from "$/server/api/root";
import cn from "$/lib/utils/cn";
import truncateString from "$/lib/utils/truncate-string";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { Menu } from "@headlessui/react";
import { api } from "$/lib/utils/api";
import { Check, X } from "lucide-react";
import { Badge } from "$/components/ui/badge";
import { type inferProcedureOutput } from "@trpc/server";

type Props = {
  invite: inferProcedureOutput<AppRouter["user"]["getGroupInvites"]>[number];
};

const PendingInviteRow: FC<Props> = ({ invite }) => {
  const utils = api.useContext();
  const acceptMutation = api.user.acceptGroupInvite.useMutation({
    onSuccess: async (res) => {
      const prevData = utils.user.getGroupInvites.getData() ?? [];

      utils.user.getGroupInvites.setData(undefined, [
        ...prevData.filter((invite) => invite.groupId !== res.groupId),
      ]);

      await utils.user.getSharedGroups.invalidate();

      return {
        prevData,
      };
    },
  });
  const declineMutation = api.user.declineGroupInvite.useMutation({
    onSuccess: (res) => {
      const prevData = utils.user.getGroupInvites.getData() ?? [];

      utils.user.getGroupInvites.setData(undefined, [
        ...prevData.filter((invite) => invite.groupId !== res.groupId),
      ]);

      return {
        prevData,
      };
    },
  });

  return (
    <Menu.Item key={invite.groupId}>
      {({ active }) => (
        <div
          className={cn(
            active && "bg-background-secondary dark:bg-background-tertiary",
            "flex w-full items-center justify-between gap-1 self-stretch px-4 py-2 text-sm"
          )}
        >
          <div className="flex flex-col gap-1.5 font-medium">
            <span>{invite.owner} te invitó al grupo</span>

            <Badge className="self-start rounded-sm">
              {truncateString(invite.groupName, 14)}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border-2 border-success p-0.5 text-success hover:bg-success/10"
              onClick={() => {
                void toast.promise(
                  acceptMutation.mutateAsync({
                    groupId: invite.groupId,
                  }),
                  {
                    loading: "Aceptando invitación...",
                    success: "Invitación aceptada",
                    error: handleToastError,
                  }
                );
              }}
            >
              <Check className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="rounded-full border-2 border-destructive p-0.5 text-destructive hover:bg-destructive/10"
              onClick={() => {
                void toast.promise(
                  declineMutation.mutateAsync({
                    groupId: invite.groupId,
                  }),
                  {
                    loading: "Rechazando invitación...",
                    success: "Invitación rechazada",
                    error: handleToastError,
                  }
                );
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </Menu.Item>
  );
};

export default PendingInviteRow;
