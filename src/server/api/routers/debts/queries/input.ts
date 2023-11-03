import { z } from "zod";
import { paginationSkipSchema } from "$/server/api/routers/debts/queries/(lib)/pagination-skip-schema";

export const debtsAsBorrowerInput = z.object({
  skip: paginationSkipSchema,
  status: z.union([
    z.literal("active"),
    z.literal("archived"),
    z.literal("all"),
  ]),
  sort: z.union([z.literal("asc"), z.literal("desc")]),
  partnerEmail: z.string().email().nullable(),
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

export const debtsAsLenderInput = z.object({
  skip: paginationSkipSchema,
  status: z.union([
    z.literal("active"),
    z.literal("archived"),
    z.literal("all"),
    z.literal("pending-confirmation"),
  ]),
  sort: z.union([z.literal("asc"), z.literal("desc")]),
  partnerEmail: z.string().email().nullable(),
});
export type DebtsAsLenderInput = z.infer<typeof debtsAsLenderInput>;

export const statusOptions = [
  {
    value: "active",
    label: "Activas",
  },
  {
    value: "pending-confirmation",
    label: "Pago por confirmar",
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
  value: DebtsAsLenderInput["status"];
  label: string;
}>;
