import { z } from "zod";

export const acceptGroupInviteInput = z.object({
  debtId: z.string().uuid(),
});
export type AcceptGroupInviteInput = z.infer<typeof acceptGroupInviteInput>;

export const declineGroupInviteInput = z.object({
  debtId: z.string().uuid(),
});
export type DeclineGroupInviteInput = z.infer<typeof declineGroupInviteInput>;
