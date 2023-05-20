import { type FC } from "react";
import { type AppRouter } from "$/server/api/root";
import { cn } from "$/lib/utils/cn";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { api } from "$/lib/utils/api";
import { Check, X } from "lucide-react";
import { type inferProcedureOutput } from "@trpc/server";
import { Popover } from "$/components/ui/popover";
import { Button } from "$/components/ui/button";
import { Separator } from "$/components/ui/separator";
import { useRouter } from "next/router";
import { Pages } from "$/lib/enums/pages";

type Props = {
  invite: NonNullable<
    inferProcedureOutput<AppRouter["user"]["getDebtsInvites"]>
  >[number];
};

const PendingInviteRow: FC<Props> = ({ invite }) => {
  const router = useRouter();
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
        "flex w-full items-center justify-between gap-1 self-stretch text-base"
      )}
    >
      <div className="flex flex-col gap-2.5 font-medium sm:flex-row sm:items-center">
        <span>{invite.debt.lender.name} te invitó a:</span>

        <Popover>
          <Popover.Trigger asChild>
            <Button variant="outline" size="sm" className="self-start">
              <span className="max-w-[100px] truncate">{invite.debt.name}</span>
            </Button>
          </Popover.Trigger>

          <Popover.Content>
            <div className="flex flex-col gap-1.5 p-2">
              <span className="font-medium">{invite.debt.name}</span>
              {invite.debt.description !== undefined && (
                <span className="text-sm">{invite.debt.description}</span>
              )}
              <Separator />
              Monto: {invite.debt.amount.toLocaleString()}
            </div>
          </Popover.Content>
        </Popover>
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

            void router.push(Pages.DASHBOARD, {
              query: {
                group: "shared",
              },
            });
          }}
        >
          <span className="sr-only">Aceptar invitación</span>
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
