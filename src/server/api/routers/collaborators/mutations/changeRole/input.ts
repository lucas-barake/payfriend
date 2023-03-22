import { z } from "zod";

export const changeRoleInput = z.object({
  debtTableId: z.string().cuid(),
  userId: z.string().cuid(),
  role: z.enum(["VIEWER", "COLLABORATOR"]),
});
export type ChangeRoleInput = z.infer<typeof changeRoleInput>;
