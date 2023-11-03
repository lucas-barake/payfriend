import { z } from "zod";

export const createPersonalExpenseInput = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  description: z
    .string()
    .trim()
    .max(100, {
      message: "La descripción debe tener menos de 100 caracteres",
    })
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  currency: z.string(),
  amount: z.number(),
});
export type CreatePersonalExpenseInput = z.infer<
  typeof createPersonalExpenseInput
>;

export const editPersonalExpenseInput = createPersonalExpenseInput.extend({
  id: z.string().uuid(),
});
