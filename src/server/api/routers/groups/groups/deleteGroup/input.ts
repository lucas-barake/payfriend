import { z } from "zod";

export const deleteGroupInput = z.object({
  groupId: z.string().cuid(),
});
export type DeleteGroupInput = z.infer<typeof deleteGroupInput>;
