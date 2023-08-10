import { z } from "zod";
import { paginationSkipSchema } from "$/server/api/routers/debts/get-debts/(lib)/pagination-skip-schema";

export const debtsAsBorrowerInput = z.object({
  skip: paginationSkipSchema,
  status: z.union([
    z.literal("active"),
    z.literal("archived"),
    z.literal("all"),
  ]),
  sort: z.union([z.literal("asc"), z.literal("desc")]),
});
export type DebtsAsBorrowerInput = z.infer<typeof debtsAsBorrowerInput>;

export const borrowerStatusOptions = [
  {
    value: "active",
    label: "Activas",
  },
  {
    value: "archived",
    label: "Concluidas",
  },
  {
    value: "all",
    label: "Todas",
  },
] as const satisfies ReadonlyArray<{
  value: DebtsAsBorrowerInput["status"];
  label: string;
}>;
