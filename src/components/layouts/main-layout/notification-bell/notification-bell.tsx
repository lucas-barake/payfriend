import React from "react";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Bell } from "lucide-react";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import PendingInviteRow from "$/components/layouts/main-layout/notification-bell/pending-invite-row";
import { Separator } from "$/components/ui/separator";
import { ScrollArea } from "$/components/ui/scroll-area";
import { AttentionIndicator } from "$/components/common/attention-indicator";

const NotificationBell: React.FC = () => {
  const [hasAlreadyOpened, setHasAlreadyOpened] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const query = api.user.getDebtsInvites.useQuery(undefined, {
    staleTime: TimeInMs.TenSeconds,
    refetchOnWindowFocus: true,
    retry: false,
    onSuccess(data) {
      if (data.length > 0 && !hasAlreadyOpened) {
        setOpen(true);
        setHasAlreadyOpened(true);
      }
    },
  });
  const allPendingInvites = query.data ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon">
          <div className="relative inline-flex">
            <Bell className="h-5 w-5" />
            {allPendingInvites.length > 0 && <AttentionIndicator />}
          </div>

          <span className="sr-only">Notificaciones</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header className="text-lg">Notificaciones</Dialog.Header>

        <ScrollArea className="my-4 h-96 px-1">
          {allPendingInvites.length === 0 ? (
            <div className="flex w-full items-center gap-1 self-stretch text-sm">
              No hay invitaciones pendientes
            </div>
          ) : (
            allPendingInvites.map((invite) => (
              <div key={invite.debt.id} className="flex flex-col gap-2 py-2">
                <PendingInviteRow invite={invite} />
                <Separator />
              </div>
            ))
          )}
        </ScrollArea>

        <Dialog.Footer>
          <Dialog.Trigger asChild>
            <Button size="sm" className="text-sm" variant="secondary">
              Cerrar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default NotificationBell;
