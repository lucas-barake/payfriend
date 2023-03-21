import { z } from "zod";

export const acceptInviteInput = z.object({
  debtTableId: z.string().cuid(),
});
export type AcceptInviteInput = z.infer<typeof acceptInviteInput>;
