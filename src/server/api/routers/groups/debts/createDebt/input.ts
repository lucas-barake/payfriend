import { z } from "zod";

export const createDebtInput = z.object({
  description: z.string().trim().min(1),
  amount: z.number().min(1),
  dueDate: z.date().min(new Date()).optional(),
  borrowerId: z.string().cuid(),
  groupId: z.string().cuid(),
});
export type CreateDebtInput = z.infer<typeof createDebtInput>;
