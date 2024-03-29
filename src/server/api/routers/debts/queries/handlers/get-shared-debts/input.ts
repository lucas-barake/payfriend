import { z } from "zod";
import { paginationSkipSchema } from "$/server/api/routers/debts/queries/handlers/lib/pagination-skip-schema";

export const borrowerDebtsQueryInput = z.object({
  skip: paginationSkipSchema,
  status: z.union([
    z.literal("active"),
    z.literal("archived"),
    z.literal("all"),
  ]),
  sort: z.union([z.literal("asc"), z.literal("desc")]),
});
export type BorrowerDebtsQueryInput = z.infer<typeof borrowerDebtsQueryInput>;

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
  value: BorrowerDebtsQueryInput["status"];
  label: string;
}>;
