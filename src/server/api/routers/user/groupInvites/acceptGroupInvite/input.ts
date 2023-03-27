import { z } from "zod";

export const acceptGroupInviteInput = z.object({
  groupId: z.string().cuid(),
});
export type AcceptGroupInviteInput = z.infer<typeof acceptGroupInviteInput>;
