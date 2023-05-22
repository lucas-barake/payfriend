import { z } from "zod";

export const createDebtInput = z.object({
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
    })
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  amount: z.number().min(1, {
    message: "El monto debe ser mayor a 0",
  }),
  borrowerEmails: z
    .array(z.string().email("Debes agregar un correo válido"))
    .min(1, {
      message: "Debes agregar al menos un correo",
    })
    .max(4, {
      message: "No puedes agregar más de 4 correos",
    })
    .refine((emails) => {
      const uniqueEmails = new Set(emails);
      return uniqueEmails.size === emails.length;
    }, "No puedes agregar correos duplicados"),
});
export type CreateDebtInput = z.infer<typeof createDebtInput>;

export const updateDebtInput = createDebtInput.extend({
  id: z
    .string({
      invalid_type_error: "El id debe ser un string",
      required_error: "El id es requerido",
    })
    .cuid({
      message: "El id no es válido",
    }),
});
export type UpdateDebtInput = z.infer<typeof updateDebtInput>;

export const sendDebtInviteInput = z.object({
  email: z.string().email({
    message: "Correo inválido",
  }),
  debtId: z.string().cuid(),
});
export type SendDebtInviteInput = z.infer<typeof sendDebtInviteInput>;
