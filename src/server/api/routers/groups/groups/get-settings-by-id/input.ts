import { z } from "zod";

export const getSettingsInput = z.object({
  groupId: z.string().cuid(),
});
export type GetSettingsInput = z.infer<typeof getSettingsInput>;
