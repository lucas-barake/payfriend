import { type PaymentStatus } from "@prisma/client";

export const paymentStatusMap = new Map<PaymentStatus, string>([
  ["PENDING_CONFIRMATION", "Por confirmar"],
  ["PAID", "Pagado"],
  ["MISSED", "Sin pagar"],
]);
