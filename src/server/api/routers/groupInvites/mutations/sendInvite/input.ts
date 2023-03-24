import { z } from "zod";

export const sendInviteInput = z.object({
  email: z.string().email({
    message: "Correo inválido",
  }),
  debtTableId: z.string().cuid(),
  role: z.enum(["VIEWER", "COLLABORATOR"]),
});
export type SendInviteInput = z.infer<typeof sendInviteInput>;
export const sendInviteRoleOptions = [
  {
    label: "Solo ver",
    value: "VIEWER",
  },
  {
    label: "Ver y editar",
    value: "COLLABORATOR",
  },
];
