import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Card } from "$/components/ui/card";
import { Button } from "$/components/ui/button";
import { api } from "$/lib/utils/api";
import { useSession } from "next-auth/react";
import * as LucideIcons from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SubscriptionsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
}) => {
  const [openCancelSubscriptionDialog, setOpenCancelSubscriptionDialog] =
    React.useState(false);
  const session = useSession();
  const hasActiveSubscription = Boolean(session.data?.user.activeSubscription);
  const subscribeMutation = api.subscriptions.generateLink.useMutation({
    onSuccess(data) {
      window.open(data.paymentLink);
    },
  });
  const cancelSubscriptionMutation =
    api.subscriptions.cancelSubscription.useMutation({
      onSuccess() {
        setOpenCancelSubscriptionDialog(false);
        void session.update({
          activeSubscription: null,
        });
      },
    });

  return (
    <>
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
                cancelSubscriptionMutation.mutate();
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
          <Dialog.Header>
            <Dialog.Title>Suscripciones</Dialog.Title>
            <Dialog.Description>
              ¡Aprovecha al máximo nuestra aplicación y eleva tu experiencia hoy
              mismo!
            </Dialog.Description>
          </Dialog.Header>

          <Card>
            <Card.Header>
              <Card.Title>Plan Premium</Card.Title>
              <Card.Subtitle className="text-success-text">
                COP $5.900 / Mes
              </Card.Subtitle>
              <Card.Description>
                Obtén lo mejor de nuestra aplicación con el Plan Premium. Lleva
                el control de tus deudas de manera más efectiva y sin límites.
              </Card.Description>
            </Card.Header>

            <Card.Content>
              <ul className="ml-4 list-disc [&>li]:mt-4">
                <li>
                  <span className="font-bold">Crea Deudas sin Límites</span>{" "}
                  <p className="block">
                    Podrás crear tantas deudas como desees, sin restricciones.
                    Administra tus finanzas con total libertad y sin
                    preocupaciones.
                  </p>
                </li>

                <li>
                  <span className="font-bold">Únete a Deudas Ilimitadas</span>{" "}
                  <p className="block">
                    No hay límite para unirte a deudas creadas por otros
                    usuarios. Conéctate con amigos, familiares o compañeros para
                    compartir gastos y alcanzar objetivos financieros juntos.{" "}
                  </p>
                </li>

                <li>
                  <span className="font-bold">
                    Acceso Prioritario a Nuevas Funcionalidades
                  </span>
                  <p className="block">
                    Serás el primero en disfrutar de las nuevas funcionalidades
                    y mejoras que se añadan a la aplicación. Siempre estarás a
                    la vanguardia de las últimas innovaciones.
                  </p>
                </li>
              </ul>
            </Card.Content>

            <Card.Footer className="justify-center">
              <Button
                onClick={() => {
                  if (hasActiveSubscription) {
                    setOpenCancelSubscriptionDialog(true);
                    return;
                  }
                  subscribeMutation.mutate({
                    subscriptionType: "BASIC",
                  });
                }}
                loading={subscribeMutation.isLoading}
                variant={hasActiveSubscription ? "destructive" : "default"}
              >
                {hasActiveSubscription ? (
                  <>
                    <LucideIcons.X className="mr-1.5 h-4 w-4" />
                    <span>Cancelar Suscripción</span>
                  </>
                ) : (
                  <>
                    <span>Suscribirme Ahora</span>
                  </>
                )}
              </Button>
            </Card.Footer>
          </Card>
        </Dialog.Content>
      </Dialog>
    </>
  );
};
