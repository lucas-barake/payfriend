import { z } from "zod";

export const updateSessionSubscription = z.object({
  cancelledSubscription: z.boolean(),
});
export type UpdateSessionSubscription = z.infer<
  typeof updateSessionSubscription
>;
