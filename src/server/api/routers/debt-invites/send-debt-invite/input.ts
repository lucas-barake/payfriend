import { z } from "zod";

export const sendDebtInviteInput = z.object({
  email: z.string().email({
    message: "Correo inválido",
  }),
  debtId: z.string().uuid(),
});
export type SendDebtInviteInput = z.infer<typeof sendDebtInviteInput>;
