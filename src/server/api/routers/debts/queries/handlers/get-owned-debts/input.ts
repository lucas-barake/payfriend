import { z } from "zod";
import { paginationSkipSchema } from "$/server/api/routers/debts/queries/handlers/lib/pagination-skip-schema";

export const lenderDebtsQueryInput = z.object({
  skip: paginationSkipSchema,
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
