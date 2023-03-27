import { z } from "zod";

export const sendInviteInput = z.object({
  email: z.string().email({
    message: "Correo inválido",
  }),
  groupId: z.string().cuid(),
  role: z.union([
    z.literal("VIEWER").describe("Solo ver"),
    z.literal("COLLABORATOR").describe("Ver y editar"),
  ]),
});
export type SendInviteInput = z.infer<typeof sendInviteInput>;
export const sendInviteRoleOptions = sendInviteInput.shape.role.options.map(
  (option) => ({
    value: option.value,
    label: option.description,
  })
);
