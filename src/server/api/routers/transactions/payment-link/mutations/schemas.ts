import { z } from "zod";

export const generateLinkReqBodySchema = z.object({
  name: z.string({ description: "Payment link name" }),
  description: z.string({ description: "Payment link description" }),
  single_use: z.boolean(),
  collect_shipping: z.boolean({
    description: "Whether to collect shipping information from the customer",
  }),
  currency: z.literal("COP", { description: "Only COP is supported for now" }),
  amount_in_cents: z
    .number({
      description:
        "Amount in cents to charge the customer. Leave it as null if you want to let the customer choose the amount to pay",
    })
    .gt(0)
    .nullable(),
  expires_at: z
    .string({
      description:
        "Date and time when the payment link will expire. Format in ISO 8601 and UTC timezone. Example: 2021-09-30T23:59:59Z",
    })
    .nullable(),
  redirect_url: z
    .string({
      description:
        "URL to redirect the customer after the payment is completed.",
    })
    .nullable(),
  image_url: z
    .string({
      description: "URL of an image for the payment link.",
    })
    .nullable(),
  sku: z
    .string({ description: "Internal unique identifier for the product" })
    .max(36)
    .refine((value) => {
      if (!value.includes(":")) return false;
      const [userId, productId] = value.split(":");
      if (!z.string().uuid().safeParse(userId).success) return false;
      return z.number({ coerce: true }).int().safeParse(productId).success;
    }),
});
export type GenerateLinkReqBody = z.infer<typeof generateLinkReqBodySchema>;
