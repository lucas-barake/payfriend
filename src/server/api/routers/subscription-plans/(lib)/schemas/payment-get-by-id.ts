import { z } from "zod";

export const paymentGetByIdSchema = z.object({
  currency_id: z.string(),
  date_approved: z.string(),
  date_created: z.string(),
  date_last_updated: z.string(),
  date_of_expiration: z.string(),
  description: z.string(),
  id: z.number(),
  payer: z.object({
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email: z.string(),
    id: z.string(),
  }),
  status: z.union([
    z.literal("pending"),
    z.literal("approved"),
    z.literal("authorized"),
  ]),
});
