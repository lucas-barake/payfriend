import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import { api } from "$/lib/utils/api";
import { useSession } from "next-auth/react";
import * as LucideIcons from "lucide-react";
import { DateTime } from "luxon";
import { type UpdateSessionSubscription } from "$/server/auth/update-session-schemas";
import { cn } from "$/lib/utils/cn";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reachedFreeLimit?: boolean;
};

export const SubscriptionsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  reachedFreeLimit = false,
}) => {
  const [openCancelSubscriptionDialog, setOpenCancelSubscriptionDialog] =
    React.useState(false);
  const session = useSession();
  const subscription = session.data?.user.subscription;
  const isSubscriptionActiveOrPending =
    subscription?.status === "SUCCESS" || subscription?.status === "PENDING";
  const isSubscriptionCancelledAndActive =
    subscription?.status === "CANCELLED" && subscription?.isActive;
  const subscribeMutation = api.subscriptions.generateLink.useMutation({
    onSuccess(data) {
      window.location.href = data.paymentLink;
    },
  });
  const cancelSubscriptionMutation =
    api.subscriptions.cancelSubscription.useMutation({
      onSuccess() {
        setOpenCancelSubscriptionDialog(false);
        void session.update({
          cancelledSubscription: true,
        } satisfies UpdateSessionSubscription);
      },
    });

  return (
    <React.Fragment>
      <Dialog
        open={openCancelSubscriptionDialog}
        onOpenChange={setOpenCancelSubscriptionDialog}
      >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Cancelar Suscripción</Dialog.Title>
            <Dialog.Description>
              ¿Estás seguro que deseas cancelar tu suscripción?
            </Dialog.Description>
          </Dialog.Header>

          {cancelSubscriptionMutation.isError && (
            <p className="text-center text-destructive">
              {cancelSubscriptionMutation.error?.message ??
                "Ocurrió un error al cancelar la suscripción."}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              onClick={() => {
                void toast.promise(cancelSubscriptionMutation.mutateAsync(), {
                  loading: "Cancelando suscripción...",
                  success: "Suscripción cancelada",
                  error: handleMutationError,
                });
              }}
              loading={cancelSubscriptionMutation.isLoading}
              variant="destructive"
            >
              Cancelar Suscripción
            </Button>

            <Button
              onClick={() => {
                setOpenCancelSubscriptionDialog(false);
              }}
              variant="secondary"
            >
              Cancelar
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
          <LucideIcons.CrownIcon className="mx-auto h-12 w-12 text-yellow-600 dark:text-yellow-500" />

          <Dialog.Header>
            <Dialog.Title
              className={cn(reachedFreeLimit && "text-warning-text")}
            >
              {reachedFreeLimit
                ? "¡Ups! Límite alcanzado"
                : "Haz más con Premium"}
            </Dialog.Title>

            <Dialog.Description>
              {reachedFreeLimit
                ? "Has alcanzado el límite de deudas gratuitas. Con nuestro plan gratuito, puedes crear y unirte a un máximo de 5 deudas al mes. Pero no te preocupes, puedes suscribirte a nuestro Plan Premium y disfrutar de todas las funcionalidades de la aplicación."
                : "Obtén lo mejor de nuestra aplicación con el Plan Premium. Lleva el control de tus deudas de manera más efectiva y sin límites."}
            </Dialog.Description>
          </Dialog.Header>

          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2.5">
              <LucideIcons.CheckIcon className="h-5 w-5 rounded-full bg-green-600 stroke-[4] p-1 text-success-foreground" />
              <span>Crea Deudas sin Límites</span>
            </li>

            <li className="flex items-center gap-2.5">
              <LucideIcons.CheckIcon className="h-5 w-5 rounded-full bg-green-600 stroke-[4] p-1 text-success-foreground" />
              <span>Únete a Deudas Ilimitadas</span>
            </li>

            <li className="flex items-center gap-2.5">
              <LucideIcons.CheckIcon className="h-5 w-5 rounded-full bg-green-600 stroke-[4] p-1 text-success-foreground" />
              <span>Acceso Prioritario a Nuevas Funcionalidades</span>
            </li>
          </ul>

          <p className="mt-2 text-center text-lg font-medium text-success-text">
            Solo $5.900 COP al mes
          </p>

          <Button
            onClick={() => {
              if (isSubscriptionCancelledAndActive) return;

              void toast.promise(
                subscribeMutation.mutateAsync({
                  subscriptionType: "BASIC",
                }),
                {
                  loading: "Creando suscripción...",
                  success: "Suscripción creada exitosamente.",
                  error: handleMutationError,
                }
              );
            }}
            loading={subscribeMutation.isLoading}
            disabled={
              isSubscriptionCancelledAndActive || isSubscriptionActiveOrPending
            }
            className="h-12"
          >
            <span>Suscribirme Ahora</span>
          </Button>

          {isSubscriptionActiveOrPending && (
            <button
              type="button"
              className="mt-1.5 text-xs text-muted-foreground underline"
              onClick={() => {
                setOpenCancelSubscriptionDialog(true);
              }}
            >
              Cancelar Suscripción
            </button>
          )}

          {isSubscriptionCancelledAndActive && (
            <div className="flex flex-col gap-1">
              <p className="mt-2 text-center text-sm">
                * Puedes volver a suscribirte una vez finalice tu periodo
                actual.
              </p>

              <p className="text-center text-sm text-muted-foreground">
                Tu suscripción finaliza:{" "}
                {DateTime.fromISO(
                  session.data?.user.subscription?.nextDueDate ?? ""
                ).toLocaleString(DateTime.DATE_FULL)}
              </p>
            </div>
          )}

          {(!isSubscriptionCancelledAndActive ||
            !isSubscriptionActiveOrPending) && (
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="mt-1.5 text-xs text-muted-foreground"
              >
                Saltar por ahora
              </button>
            </Dialog.Trigger>
          )}
        </Dialog.Content>
      </Dialog>
    </React.Fragment>
  );
};
