import { z } from "zod";

export const acceptInviteInput = z.object({
  groupId: z.string().cuid(),
});
export type AcceptInviteInput = z.infer<typeof acceptInviteInput>;
