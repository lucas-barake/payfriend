import { z } from "zod";

export const querySchema = z.object({
  "data.id": z.number({ coerce: true }),
  type: z.union([
    z.literal("payment"),
    z.literal("plan"),
    z.literal("subscription"),
    z.literal("invoice"),
    z.literal("point_integration_wh"),
  ]),
});
