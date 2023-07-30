import { z } from "zod";
import { SubscriptionType } from "@prisma/client";

export const generateLinkInput = z.object({
  subscriptionType: z.nativeEnum(SubscriptionType),
});
export type GenerateLinkInput = z.infer<typeof generateLinkInput>;
