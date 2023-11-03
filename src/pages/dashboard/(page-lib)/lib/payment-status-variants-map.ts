import { PaymentStatus } from "@prisma/client";
import { type BadgeProps } from "$/components/ui/badge";

export const paymentStatusVariantsMap = new Map<
  PaymentStatus,
  BadgeProps["variant"]
>([
  [PaymentStatus.PENDING_CONFIRMATION, "warning"],
  [PaymentStatus.PAID, "success"],
  [PaymentStatus.MISSED, "destructive"],
]);
