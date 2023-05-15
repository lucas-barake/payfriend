import { z } from "zod";

export const acceptGroupInviteInput = z.object({
  groupId: z.string().cuid(),
});
export type AcceptGroupInviteInput = z.infer<typeof acceptGroupInviteInput>;

export const declineGroupInviteInput = z.object({
  groupId: z.string(),
});
export type DeclineGroupInviteInput = z.infer<typeof declineGroupInviteInput>;

export const sendGroupInviteInput = z.object({
  email: z.string().email({
    message: "Correo inválido",
  }),
  groupId: z.string().cuid(),
  role: z.union([
    z.literal("VIEWER").describe("Solo ver"),
    z.literal("COLLABORATOR").describe("Ver y editar"),
  ]),
});
export type SendGroupInviteInput = z.infer<typeof sendGroupInviteInput>;
export const sendInviteRoleOptions =
  sendGroupInviteInput.shape.role.options.map((option) => ({
    value: option.value,
    label: option.description,
  }));
