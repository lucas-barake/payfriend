import { PaymentStatus } from "@prisma/client";
import { type BadgeProps } from "$/components/ui/badge";

export const paymentStatusVariantsMap: Map<
  PaymentStatus,
  BadgeProps["variant"]
> = new Map([
  [PaymentStatus.PENDING_CONFIRMATION, "warning"],
  [PaymentStatus.PAID, "success"],
  [PaymentStatus.MISSED, "destructive"],
]);
