import { z } from "zod";

export const lenderDebtsQueryInput = z.object({
  limit: z.number().int().min(1).max(8).optional(),
  skip: z.number().int().optional(),
  status: z.union([
    z.literal("active"),
    z.literal("archived"),
    z.literal("all"),
    z.literal("pending-confirmation"),
  ]),
  sort: z.union([z.literal("asc"), z.literal("desc")]),
});
export type LenderDebtsQueryInput = z.infer<typeof lenderDebtsQueryInput>;

export const statusOptions = [
  {
    value: "active",
    label: "Activas",
  },
  {
    value: "archived",
    label: "Concluidas",
  },
  {
    value: "pending-confirmation",
    label: "Pago por confirmar",
  },
  {
    value: "all",
    label: "Todas",
  },
] as const satisfies ReadonlyArray<{
  value: LenderDebtsQueryInput["status"];
  label: string;
}>;
