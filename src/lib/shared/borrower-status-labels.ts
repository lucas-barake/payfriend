import { BorrowerStatus } from "@prisma/client";

const map = [
  [BorrowerStatus.YET_TO_PAY, "Por pagar"],
  [BorrowerStatus.PENDING_CONFIRMATION, "Pago por confirmar"],
  [BorrowerStatus.CONFIRMED, "Confirmado"],
] as const satisfies ReadonlyArray<readonly [BorrowerStatus, string]>;

export const borrowerStatusLabels = new Map(map);
