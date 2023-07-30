import { z } from "zod";

export const paginationInput = z.object({
  limit: z.number().int().min(1).max(10),
  skip: z.number().int().optional(),
});
