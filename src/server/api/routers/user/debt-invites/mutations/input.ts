import { z } from "zod";

export const acceptGroupInviteInput = z.object({
  debtId: z.string().cuid(),
});
export type AcceptGroupInviteInput = z.infer<typeof acceptGroupInviteInput>;

export const declineGroupInviteInput = z.object({
  debtId: z.string().cuid(),
});
export type DeclineGroupInviteInput = z.infer<typeof declineGroupInviteInput>;
