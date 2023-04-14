import { z } from "zod";

export const removeUserFromGroupFromInput = z.object({
  groupId: z.string().cuid(),
  userId: z.string().cuid(),
  isPending: z.boolean(),
});
export type RemoveUserFromGroupFromInput = z.infer<
  typeof removeUserFromGroupFromInput
>;
