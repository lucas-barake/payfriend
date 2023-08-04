import { z } from "zod";

export const borrowerDebtsQueryInput = z.object({
  limit: z.number().int().min(1).max(8).optional(),
  skip: z.number().int().optional(),
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
