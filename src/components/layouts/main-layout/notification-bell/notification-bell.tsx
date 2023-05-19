import { type FC } from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Bell } from "lucide-react";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import PendingInviteRow from "$/components/layouts/main-layout/notification-bell/pending-invite-row";

const NotificationBell: FC = () => {
  const query = api.user.getDebtsInvites.useQuery(undefined, {
    staleTime: TimeInMs.TenSeconds,
    refetchOnWindowFocus: true,
    retry: false,
  });
  const allPendingInvites = query.data ?? [];

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm">
          <div className="relative inline-flex">
            <Bell className="h-5 w-5" />

            {allPendingInvites.length > 0 && (
              <span className="absolute right-0.5 top-0.5 -mr-1 -mt-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            )}
          </div>

          <span className="sr-only">Notificaciones</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>Notificaciones</Dialog.Header>

        {allPendingInvites.length === 0 ? (
          <div className="flex w-full items-center gap-1 self-stretch text-sm">
            No hay invitaciones pendientes
          </div>
        ) : (
          allPendingInvites.map((invite) => (
            <PendingInviteRow key={invite.debt.id} invite={invite} />
          ))
        )}

        <Dialog.Footer>
          <Dialog.Trigger asChild>
            <Button size="sm" className="text-sm" variant="tertiary">
              Cerrar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default NotificationBell;
