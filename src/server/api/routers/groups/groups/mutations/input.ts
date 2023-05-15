import { z } from "zod";

export const deleteGroupInput = z.object({
  groupId: z.string().cuid(),
});
export type DeleteGroupInput = z.infer<typeof deleteGroupInput>;

export const createGroupInput = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser un string",
      required_error: "El nombre es requerido",
    })
    .trim()
    .min(1, {
      message: "El nombre es requerido",
    })
    .max(40, {
      message: "El nombre debe tener menos de 40 caracteres",
    }),
  description: z
    .string({
      invalid_type_error: "La descripción debe ser un string",
    })
    .trim()
    .max(100, {
      message: "La descripción debe tener menos de 100 caracteres",
    }),
});
export type CreateGroupInput = z.infer<typeof createGroupInput>;

export const updateGroupInput = createGroupInput.extend({
  id: z
    .string({
      invalid_type_error: "El id debe ser un string",
      required_error: "El id es requerido",
    })
    .cuid({
      message: "El id no es válido",
    }),
});
export type UpdateGroupInput = z.infer<typeof updateGroupInput>;
