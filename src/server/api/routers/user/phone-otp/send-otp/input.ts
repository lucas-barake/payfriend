import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { format } from "libphonenumber-js";

function addPhoneIssue(ctx: z.RefinementCtx) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "El número de teléfono no es válido",
    path: ["phone"],
  });
}

export const sendPhoneOtpInput = z
  .object({
    phone: z
      .string()
      .trim()
      .min(2, { message: "El número de teléfono no es válido" }),
    countryCode: z.union([z.literal("CO"), z.literal("US"), z.literal("MX")], {
      invalid_type_error: "El código de país no es válido",
    }),
  })
  .superRefine((val, ctx) => {
    try {
      const phoneNumber = parsePhoneNumber(val.phone, val.countryCode);

      if (!phoneNumber) {
        addPhoneIssue(ctx);
        return z.NEVER;
      }

      if (!phoneNumber.isValid()) {
        addPhoneIssue(ctx);
        return z.NEVER;
      }

      return phoneNumber;
    } catch (e) {
      // parsePhoneNumber for some reason throws an error if the length is less than a certain number
      addPhoneIssue(ctx);
      return z.NEVER;
    }
  })
  .transform((v) => ({
    phone: format(v.phone, v.countryCode, "INTERNATIONAL"),
    countryCode: v.countryCode,
  }));
export type SendPhoneOtpInput = z.infer<typeof sendPhoneOtpInput>;
