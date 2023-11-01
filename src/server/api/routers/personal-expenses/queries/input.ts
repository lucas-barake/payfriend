import { paginationSkipSchema } from "$/server/api/routers/debts/queries/(lib)/pagination-skip-schema";
import { z } from "zod";

export const getPersonalExpensesInput = z.object({
  orderBy: z.object({
    createdAt: z.union([z.literal("asc"), z.literal("desc")]).nullable(),
    amount: z.union([z.literal("asc"), z.literal("desc")]).nullable(),
  }),
  skip: paginationSkipSchema,
});
export type GetPersonalExpensesInput = z.infer<typeof getPersonalExpensesInput>;
export const PERSONAL_EXPENSES_PAGINATION_LIMIT = 8;
