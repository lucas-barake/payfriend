import { type FC } from "react";
import { type AppRouter } from "$/server/api/root";
import { cn } from "$/lib/utils/cn";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { api } from "$/lib/utils/api";
import { Check, X } from "lucide-react";
import { Badge } from "$/components/ui/badge";
import { type inferProcedureOutput } from "@trpc/server";
import { strTransformer } from "$/lib/utils/str-transformer";

type Props = {
  invite: NonNullable<
    inferProcedureOutput<AppRouter["user"]["getDebtsInvites"]>
  >[number];
};

const PendingInviteRow: FC<Props> = ({ invite }) => {
  const utils = api.useContext();
  const acceptMutation = api.user.acceptDebtInvite.useMutation({
    onSuccess: async (res) => {
      const prevData = utils.user.getDebtsInvites.getData() ?? [];

      utils.user.getDebtsInvites.setData(undefined, [
        ...prevData.filter((invite) => invite.debt.id !== res.debtId),
      ]);

      await utils.user.getSharedDebts.invalidate();

      return {
        prevData,
      };
    },
  });
  const declineMutation = api.user.declineDebtInvite.useMutation({
    onSuccess: (res) => {
      const prevData = utils.user.getDebtsInvites.getData() ?? [];

      utils.user.getDebtsInvites.setData(undefined, [
        ...prevData.filter((invite) => invite.debt.id !== res.debtId),
      ]);

      return {
        prevData,
      };
    },
  });

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-1 self-stretch px-4 py-2 text-sm hover:bg-background-secondary hover:dark:bg-background-tertiary"
      )}
    >
      <div className="flex flex-col gap-1.5 font-medium">
        <span>{invite.debt.lender.name} te invitó al grupo</span>

        <Badge className="self-start rounded-sm">
          {strTransformer.truncate(invite.debt.name, 14)}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border-2 border-success p-0.5 text-success hover:bg-success/10"
          onClick={() => {
            void toast.promise(
              acceptMutation.mutateAsync({
                debtId: invite.debt.id,
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
                debtId: invite.debt.id,
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
  );
};

export default PendingInviteRow;
