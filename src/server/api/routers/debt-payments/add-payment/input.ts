import { z } from "zod";

export const addPaymentInput = z.discriminatedUnion("fullPayment", [
  z.object({
    fullPayment: z.literal(true),
    amount: z.null(),
    debtId: z.string().uuid(),
  }),
  z.object({
    fullPayment: z.literal(false),
    amount: z
      .number({
        required_error: "La cantidad es requerida",
        invalid_type_error: "La cantidad es requerida",
      })
      .positive({
        message: "La cantidad ser mayor a 0",
      })
      .multipleOf(0.01, {
        message: "La cantidad debe ser múltiplo de 0.01",
      }),
    debtId: z.string().uuid(),
  }),
]);
export type AddPaymentInput = z.infer<typeof addPaymentInput>;
