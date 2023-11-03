import React from "react";
import { useSession } from "next-auth/react";
import { SubscriptionsDialog } from "$/components/common/subscriptions-dialog";
import { Button } from "$/components/ui/button";
import * as LucideIcons from "lucide-react";

export const SubscriptionButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const session = useSession();
  const activeSubscription =
    session?.data?.user.subscription?.isActive ?? false;

  if (activeSubscription) return null;

  return (
    <React.Fragment>
      <SubscriptionsDialog open={open} onOpenChange={setOpen} />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setOpen(true);
        }}
        className="bg-yellow-500/10 hover:bg-yellow-500/20 dark:bg-yellow-500/5 dark:hover:bg-yellow-500/10"
      >
        <LucideIcons.Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
        <span className="sr-only">Planes de Suscripción</span>
      </Button>
    </React.Fragment>
  );
};
