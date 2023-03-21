import { z } from "zod";

export const cancelInviteInput = z.object({
  debtTableId: z.string(),
});
export type CancelInviteInput = z.infer<typeof cancelInviteInput>;
