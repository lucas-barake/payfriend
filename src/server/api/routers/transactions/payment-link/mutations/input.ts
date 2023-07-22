import { z } from "zod";

export const generateLinkInput = z.object({
  duration: z.literal("1m"),
});
