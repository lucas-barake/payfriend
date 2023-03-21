import { z } from "zod";

export const createDebTableInput = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser un string",
      required_error: "El nombre es requerido",
    })
    .trim()
    .min(1, {
      message: "El nombre es requerido",
    })
    .max(50, {
      message: "El nombre debe tener menos de 50 caracteres",
    }),
  description: z
    .string({
      invalid_type_error: "La descripción debe ser un string",
      required_error: "La descripción es requerida",
    })
    .trim()
    .min(1, {
      message: "La descripción es requerida",
    })
    .max(200, {
      message: "La descripción debe tener menos de 200 caracteres",
    }),
});
export type CreateDebtTableInput = z.infer<typeof createDebTableInput>;
