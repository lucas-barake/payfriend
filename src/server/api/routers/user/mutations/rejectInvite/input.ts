import { z } from "zod";

export const cancelInviteInput = z.object({
  groupId: z.string(),
});
export type CancelInviteInput = z.infer<typeof cancelInviteInput>;
